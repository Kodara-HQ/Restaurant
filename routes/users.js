const express = require('express');
const router = express.Router();
const { supabase } = require('../server');

// Get all users (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, role, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, is_active, created_at', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (role) {
      query = query.eq('role', role);
    }

    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
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
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      details: error.message
    });
  }
});

// Update user (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.password_hash;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select('id, email, first_name, last_name, phone, role, is_active, created_at, updated_at')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
      details: error.message
    });
  }
});

// Deactivate/Activate user (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'is_active must be a boolean value'
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ is_active })
      .eq('id', id)
      .select('id, email, first_name, last_name, role, is_active')
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data,
      message: `User ${is_active ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status',
      details: error.message
    });
  }
});

// Get user addresses
router.get('/:id/addresses', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', id)
      .order('is_default', { ascending: false })
      .order('created_at');

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      message: 'User addresses retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user addresses',
      details: error.message
    });
  }
});

// Add user address
router.post('/:id/addresses', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      address_type = 'home',
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country = 'Ghana',
      is_default = false
    } = req.body;

    if (!address_line1 || !city) {
      return res.status(400).json({
        success: false,
        error: 'Address line 1 and city are required'
      });
    }

    // If this is the default address, unset other default addresses
    if (is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', id)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .insert([{
        user_id: id,
        address_type,
        address_line1,
        address_line2,
        city,
        state,
        postal_code,
        country,
        is_default
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Address added successfully'
    });
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add address',
      details: error.message
    });
  }
});

// Update user address
router.put('/:id/addresses/:address_id', async (req, res) => {
  try {
    const { id, address_id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.user_id;
    delete updateData.created_at;

    // If this is the default address, unset other default addresses
    if (updateData.is_default) {
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', id)
        .eq('is_default', true);
    }

    const { data, error } = await supabase
      .from('user_addresses')
      .update(updateData)
      .eq('id', address_id)
      .eq('user_id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Address not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Address updated successfully'
    });
  } catch (error) {
    console.error('Error updating address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update address',
      details: error.message
    });
  }
});

// Delete user address
router.delete('/:id/addresses/:address_id', async (req, res) => {
  try {
    const { id, address_id } = req.params;

    const { error } = await supabase
      .from('user_addresses')
      .delete()
      .eq('id', address_id)
      .eq('user_id', id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete address',
      details: error.message
    });
  }
});

// Get user orders
router.get('/:id/orders', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, page = 1, limit = 10 } = req.query;
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
          menu_items (
            id,
            name,
            description,
            image_url
          )
        )
      `, { count: 'exact' })
      .eq('user_id', id)
      .order('created_at', { ascending: false });

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
      message: 'User orders retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user orders',
      details: error.message
    });
  }
});

// Get user reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('reviews')
      .select(`
        *,
        restaurants (
          id,
          name
        )
      `, { count: 'exact' })
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

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
      message: 'User reviews retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user reviews',
      details: error.message
    });
  }
});

module.exports = router;
