import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    // Test query: Get all users
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(5)

    if (error) {
      console.error('❌ Supabase connection error:', error)
      return false
    }

    console.log('✅ Supabase connected successfully!')
    console.log('📊 Test users found:', data?.length || 0)
    if (data && data.length > 0) {
      console.log('👤 Sample user:', data[0].email)
    }
    return true
  } catch (err) {
    console.error('❌ Connection failed:', err)
    return false
  }
}

