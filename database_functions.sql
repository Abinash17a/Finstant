-- Create the missing budget categories function
CREATE OR REPLACE FUNCTION usp_getbudgetcategorieswithspent(
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
      ), 0
    ) as spent
  FROM budget_cat_allocations bca
  WHERE bca.user_id = p_user_id
    AND bca.month = p_month
    AND bca.year = p_year
  ORDER BY bca.name;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error in usp_getbudgetcategorieswithspent: %', SQLERRM;
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- Fix the dashboard function enum casting issue
DROP FUNCTION IF EXISTS get_dashboard_data(UUID, INT);

CREATE OR REPLACE FUNCTION get_dashboard_data(
  p_user_id UUID,
  p_limit INT DEFAULT 5
)
RETURNS JSON AS
$$
DECLARE result JSON;
BEGIN
  SELECT json_build_object(

    -- 💰 Monthly Salary
    'monthlySalary', (
      SELECT COALESCE(base_salary, 0)
      FROM users
      WHERE id = p_user_id
    ),

    -- 🎯 Total Budget (current month)
    'totalBudget', (
      SELECT COALESCE(SUM(budget), 0)
      FROM budget_cat_allocations
      WHERE user_id = p_user_id
        AND month = EXTRACT(MONTH FROM CURRENT_DATE)
        AND year = EXTRACT(YEAR FROM CURRENT_DATE)
    ),

    -- 💸 Total Spent (current month)
    'totalSpent', (
      SELECT COALESCE(SUM(amount), 0)
      FROM transactions
      WHERE user_id = p_user_id
        AND type = 'EXPENSE'
        AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
    ),

    -- 🎯 Financial Goals
    'financialGoals', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'name', name,
          'target', target,
          'current', current
        )
      ), '[]'::json)
      FROM financial_goals
      WHERE user_id = p_user_id
    ),

    -- 🧾 Recent Transactions
    'recentTransactions', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'id', t.id,
          'amount', t.amount,
          'category', t.category,
          'description', t.description,
          'date', t.date,
          'type', LOWER(t.type::text),
          'categoryColor', COALESCE(cc.color, '#888')
        )
      ), '[]'::json)
      FROM (
        SELECT *
        FROM transactions
        WHERE user_id = p_user_id
        ORDER BY date DESC
        LIMIT p_limit
      ) t
      LEFT JOIN category_colors cc
      ON t.category::text = cc.category
    )

  ) INTO result;

  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object('error', SQLERRM, 'sqlstate', SQLSTATE);
END;
$$ LANGUAGE plpgsql;
