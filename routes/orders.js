const express = require('express');
const router = express.Router();
const { supabase } = require('../server');

// Get user's orders
router.get('/', async (req, res) => {
  try {
    const { user_id, status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('orders')
      .select(`
        *,
        restaurants (
          id,
          name,
          phone,
          whatsapp
        ),
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          special_instructions,
          menu_items (
            id,
            name,
            description,
            image_url
          )
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('user_id', user_id);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      },
      message: 'Orders retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      details: error.message
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        restaurants (
          id,
          name,
          phone,
          whatsapp,
          address
        ),
        users (
          id,
          first_name,
          last_name,
          phone
        ),
        order_items (
          id,
          quantity,
          unit_price,
          total_price,
          special_instructions,
          menu_items (
            id,
            name,
            description,
            image_url,
            preparation_time
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Order retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      details: error.message
    });
  }
});

// Create new order
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      restaurant_id,
      order_type = 'delivery',
      delivery_address,
      delivery_instructions,
      items,
      notes
    } = req.body;

    // Validate required fields
    if (!user_id || !restaurant_id || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'User ID, restaurant ID, and items are required'
      });
    }

    // Calculate totals
    let total_amount = 0;
    let delivery_fee = 0;
    let tax_amount = 0;

    // Calculate delivery fee
    if (order_type === 'delivery') {
      delivery_fee = 5.00; // Default delivery fee
    }

    // Calculate tax (assuming 12.5% VAT for Ghana)
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    tax_amount = subtotal * 0.125;
    total_amount = subtotal + delivery_fee + tax_amount;

    // Generate order number
    const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id,
        restaurant_id,
        order_number,
        order_type,
        total_amount: subtotal,
        tax_amount,
        delivery_fee,
        final_amount: total_amount,
        delivery_address,
        delivery_instructions,
        notes,
        estimated_delivery_time: new Date(Date.now() + 45 * 60000) // 45 minutes from now
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
      special_instructions: item.special_instructions
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    // Clear user's cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id)
      .eq('restaurant_id', restaurant_id);

    res.status(201).json({
      success: true,
      data: {
        order,
        order_number,
        total_amount: total_amount
      },
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      details: error.message
    });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        error: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const updateData = { status };

    // Set delivery time when status changes to delivered
    if (status === 'delivered') {
      updateData.actual_delivery_time = new Date();
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      details: error.message
    });
  }
});

// Cart management routes
router.get('/cart/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        menu_items (
          id,
          name,
          description,
          price,
          currency,
          image_url
        ),
        restaurants (
          id,
          name
        )
      `)
      .eq('user_id', user_id)
      .order('created_at');

    if (error) throw error;

    // Calculate cart total
    const total = data?.reduce((sum, item) => sum + (item.menu_items.price * item.quantity), 0) || 0;

    res.json({
      success: true,
      data: {
        items: data || [],
        total: total
      },
      message: 'Cart retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart',
      details: error.message
    });
  }
});

// Add item to cart
router.post('/cart', async (req, res) => {
  try {
    const {
      user_id,
      restaurant_id,
      menu_item_id,
      quantity = 1,
      special_instructions
    } = req.body;

    if (!user_id || !restaurant_id || !menu_item_id) {
      return res.status(400).json({
        success: false,
        error: 'User ID, restaurant ID, and menu item ID are required'
      });
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user_id)
      .eq('restaurant_id', restaurant_id)
      .eq('menu_item_id', menu_item_id)
      .single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        data,
        message: 'Cart item updated successfully'
      });
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{
          user_id,
          restaurant_id,
          menu_item_id,
          quantity,
          special_instructions
        }])
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        success: true,
        data,
        message: 'Item added to cart successfully'
      });
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add item to cart',
      details: error.message
    });
  }
});

// Update cart item quantity
router.put('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, special_instructions } = req.body;

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', id);

      return res.json({
        success: true,
        message: 'Item removed from cart'
      });
    }

    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity, special_instructions })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart item',
      details: error.message
    });
  }
});

// Remove item from cart
router.delete('/cart/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove cart item',
      details: error.message
    });
  }
});

// Clear user's cart
router.delete('/cart/clear/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user_id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
      details: error.message
    });
  }
});

module.exports = router;
