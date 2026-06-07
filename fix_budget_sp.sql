-- PostgreSQL function for budget categories with spent amounts
DROP FUNCTION IF EXISTS get_budget_categories_with_spent(UUID, INT, INT);

CREATE OR REPLACE FUNCTION get_budget_categories_with_spent(
  p_user_id UUID,
  p_month INT,
  p_year INT
)
RETURNS TABLE (
  id INT,
  user_id UUID,
  name VARCHAR,
  budget DECIMAL,
  color VARCHAR,
  month INT,
  year INT,
  created_at TIMESTAMP,
  spent DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bca.id,
    bca.user_id,
    bca.name,
    bca.budget,
    bca.color,
    bca.month,
    bca.year,
    bca.created_at,
    COALESCE(
      (
        SELECT SUM(t.amount)
        FROM transactions t
        WHERE t.user_id = p_user_id
          AND t.type::text = 'EXPENSE'
          AND LOWER(t.category::text) = LOWER(bca.name)
          AND EXTRACT(MONTH FROM t.date) = p_month
          AND EXTRACT(YEAR FROM t.date) = p_year
      ),
      0
    ) AS spent
  FROM budget_cat_allocations bca
  WHERE bca.user_id = p_user_id
    AND bca.month = p_month
    AND bca.year = p_year
  ORDER BY bca.name;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in get_budget_categories_with_spent: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Test the function
-- SELECT * FROM get_budget_categories_with_spent('1c78db37-da92-4fad-a136-5e1ccc73fb33'::UUID, 5::INT, 2026::INT);
