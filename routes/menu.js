const express = require('express');
const router = express.Router();
const { supabase } = require('../server');

// Get all menu items with filtering
router.get('/items', async (req, res) => {
  try {
    const {
      restaurant_id,
      category_id,
      search,
      min_price,
      max_price,
      is_vegetarian,
      is_vegan,
      is_gluten_free,
      page = 1,
      limit = 20
    } = req.query;

    const offset = (page - 1) * limit;
    let query = supabase
      .from('menu_items_view')
      .select('*', { count: 'exact' });

    // Apply filters
    if (restaurant_id) {
      query = query.eq('restaurant_id', restaurant_id);
    }

    if (category_id) {
      query = query.eq('category_id', category_id);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (min_price) {
      query = query.gte('price', parseFloat(min_price));
    }

    if (max_price) {
      query = query.lte('price', parseFloat(max_price));
    }

    if (is_vegetarian === 'true') {
      query = query.eq('is_vegetarian', true);
    }

    if (is_vegan === 'true') {
      query = query.eq('is_vegan', true);
    }

    if (is_gluten_free === 'true') {
      query = query.eq('is_gluten_free', true);
    }

    const { data, error, count } = await query
      .order('name')
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
      message: 'Menu items retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items',
      details: error.message
    });
  }
});

// Get menu item by ID
router.get('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('menu_items')
      .select(`
        *,
        menu_categories (
          id,
          name,
          description
        ),
        restaurants (
          id,
          name,
          phone,
          whatsapp
        )
      `)
      .eq('id', id)
      .eq('is_available', true)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Menu item retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu item',
      details: error.message
    });
  }
});

// Create new menu item
router.post('/items', async (req, res) => {
  try {
    const {
      restaurant_id,
      category_id,
      name,
      description,
      price,
      currency = 'GHS',
      image_url,
      is_vegetarian = false,
      is_vegan = false,
      is_gluten_free = false,
      preparation_time,
      calories,
      allergens
    } = req.body;

    // Validate required fields
    if (!restaurant_id || !category_id || !name || !price) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID, category ID, name, and price are required'
      });
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        restaurant_id,
        category_id,
        name,
        description,
        price: parseFloat(price),
        currency,
        image_url,
        is_vegetarian,
        is_vegan,
        is_gluten_free,
        preparation_time: preparation_time ? parseInt(preparation_time) : null,
        calories: calories ? parseInt(calories) : null,
        allergens: allergens || []
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create menu item',
      details: error.message
    });
  }
});

// Update menu item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.restaurant_id;

    // Convert price to float if provided
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price);
    }

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update menu item',
      details: error.message
    });
  }
});

// Delete menu item (soft delete)
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('menu_items')
      .update({ is_available: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu item',
      details: error.message
    });
  }
});

// Get menu categories
router.get('/categories', async (req, res) => {
  try {
    const { restaurant_id } = req.query;

    let query = supabase
      .from('menu_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (restaurant_id) {
      query = query.eq('restaurant_id', restaurant_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      message: 'Menu categories retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu categories',
      details: error.message
    });
  }
});

// Create menu category
router.post('/categories', async (req, res) => {
  try {
    const {
      restaurant_id,
      name,
      description,
      display_order = 0
    } = req.body;

    if (!restaurant_id || !name) {
      return res.status(400).json({
        success: false,
        error: 'Restaurant ID and name are required'
      });
    }

    const { data, error } = await supabase
      .from('menu_categories')
      .insert([{
        restaurant_id,
        name,
        description,
        display_order: parseInt(display_order)
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Menu category created successfully'
    });
  } catch (error) {
    console.error('Error creating menu category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create menu category',
      details: error.message
    });
  }
});

// Update menu category
router.put('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.created_at;
    delete updateData.restaurant_id;

    const { data, error } = await supabase
      .from('menu_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Menu category not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Menu category updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update menu category',
      details: error.message
    });
  }
});

module.exports = router;
