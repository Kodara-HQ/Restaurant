const express = require('express');
const router = express.Router();
const { supabase } = require('../server');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('restaurant_details')
      .select('*')
      .order('name');

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
      message: 'Restaurants retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch restaurants',
      details: error.message
    });
  }
});

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        menu_categories (
          id,
          name,
          description,
          display_order,
          menu_items (
            id,
            name,
            description,
            price,
            currency,
            image_url,
            is_available,
            preparation_time,
            calories,
            allergens
          )
        ),
        restaurant_images (
          id,
          image_url,
          alt_text,
          display_order,
          is_hero
        )
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Restaurant retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch restaurant',
      details: error.message
    });
  }
});

// Create new restaurant (requires authentication)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      cuisine_type,
      address,
      phone,
      whatsapp,
      email,
      opening_hours,
      logo_url,
      hero_image_url
    } = req.body;

    // Validate required fields
    if (!name || !description || !cuisine_type) {
      return res.status(400).json({
        success: false,
        error: 'Name, description, and cuisine type are required'
      });
    }

    const { data, error } = await supabase
      .from('restaurants')
      .insert([{
        name,
        description,
        cuisine_type,
        address,
        phone,
        whatsapp,
        email,
        opening_hours,
        logo_url,
        hero_image_url,
        owner_id: req.user?.id // Will be set by auth middleware
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      data,
      message: 'Restaurant created successfully'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create restaurant',
      details: error.message
    });
  }
});

// Update restaurant
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.owner_id;

    const { data, error } = await supabase
      .from('restaurants')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data,
      message: 'Restaurant updated successfully'
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update restaurant',
      details: error.message
    });
  }
});

// Delete restaurant (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('restaurants')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete restaurant',
      details: error.message
    });
  }
});

// Get restaurant reviews
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('reviews')
      .select(`
        *,
        users (
          id,
          first_name,
          last_name
        )
      `, { count: 'exact' })
      .eq('restaurant_id', id)
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
      message: 'Reviews retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      details: error.message
    });
  }
});

module.exports = router;
