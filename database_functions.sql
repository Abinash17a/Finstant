
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
            SUM(
                CASE
                    WHEN UPPER(t.type) = 'EXPENSE'
                    THEN t.amount
                    ELSE 0
                END
            ),
            0
        ) AS spent

    FROM budget_cat_allocations bca

    LEFT JOIN transactions t
        ON t.user_id = bca.user_id
        AND LOWER(TRIM(t.category)) = LOWER(TRIM(bca.name))
        AND EXTRACT(MONTH FROM t.date) = p_month
        AND EXTRACT(YEAR FROM t.date) = p_year

    WHERE bca.user_id = p_user_id
      AND bca.month = p_month
      AND bca.year = p_year

    GROUP BY
        bca.id,
        bca.user_id,
        bca.name,
        bca.budget,
        bca.color,
        bca.month,
        bca.year,
        bca.created_at

    ORDER BY bca.name;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION
        'Error in usp_getbudgetcategorieswithspent: %',
        SQLERRM;
END;
-----------------------------------------------------------------------------------------------------------------------

DECLARE result JSON;

BEGIN

  SELECT json_build_object(

    -- 💰 Monthly Salary
    'monthlySalary', (
      SELECT COALESCE(base_salary, 0)
      FROM users
      WHERE id = p_user_id
    ),

    -- 🎯 Total Budget
 'totalBudget', (
  SELECT COALESCE(monthly_budget, 0)
  FROM users
  WHERE id = p_user_id
),

    -- 💸 Total Spent
    'totalSpent', (
      SELECT COALESCE(SUM(amount), 0)
      FROM transactions
      WHERE user_id = p_user_id
        AND UPPER(type) = 'EXPENSE'
        AND EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM date) = EXTRACT(YEAR FROM CURRENT_DATE)
    ),

    -- 🎯 Financial Goals
    'financialGoals', (
      SELECT COALESCE(
        json_agg(
          json_build_object(
            'name', name,
            'target', target,
            'current', current
          )
        ),
        '[]'::json
      )
      FROM financial_goals
      WHERE user_id = p_user_id
    ),

    -- 📊 Budget Categories
    'budgetCategories', (

      SELECT COALESCE(
        json_agg(
          json_build_object(

            'id', bca.id,
            'name', bca.name,
            'budget', bca.budget,
            'color', COALESCE(bca.color, '#888'),

            -- 💸 spent per category
            'spent',

            COALESCE(
              (
                SELECT SUM(t.amount)
                FROM transactions t
                WHERE t.user_id = p_user_id
                 AND TRIM(LOWER(t.category)) = TRIM(LOWER(bca.name))
                  AND UPPER(t.type) = 'EXPENSE'
                  AND EXTRACT(MONTH FROM t.date) = EXTRACT(MONTH FROM CURRENT_DATE)
                  AND EXTRACT(YEAR FROM t.date) = EXTRACT(YEAR FROM CURRENT_DATE)
              ),
              0
            )

          )
        ),
        '[]'::json
      )

      FROM budget_cat_allocations bca

      WHERE bca.user_id = p_user_id
        AND bca.month = EXTRACT(MONTH FROM CURRENT_DATE)
        AND bca.year = EXTRACT(YEAR FROM CURRENT_DATE)

    ),

    -- 🧾 Recent Transactions
    'recentTransactions', (

      SELECT COALESCE(
        json_agg(
          json_build_object(
            'id', t.id,
            'amount', t.amount,
            'category', t.category,
            'description', t.description,
            'date', t.date,
            'type', LOWER(t.type),
            'categoryColor', COALESCE(cc.color, '#888')
          )
        ),
        '[]'::json
      )

      FROM (
        SELECT *
        FROM transactions
        WHERE user_id = p_user_id
        ORDER BY date DESC
        LIMIT p_limit
      ) t

      LEFT JOIN category_colors cc
      ON LOWER(t.category) = LOWER(cc.category)

    ),
-- 🥧 Category Spending for Pie Chart
'categorySpending', (

  SELECT COALESCE(
    json_agg(
      json_build_object(
        'category', x.category,
        'amount', x.amount,
        'color', x.color
      )
    ),
    '[]'::json
  )

  FROM (

    SELECT
      t.category,
      SUM(t.amount) AS amount,
      COALESCE(cc.color, '#888') AS color

    FROM transactions t

    LEFT JOIN category_colors cc
      ON LOWER(t.category) = LOWER(cc.category)

    WHERE t.user_id = p_user_id
      AND UPPER(t.type) = 'EXPENSE'
      AND EXTRACT(MONTH FROM t.date) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM t.date) = EXTRACT(YEAR FROM CURRENT_DATE)

    GROUP BY
      t.category,
      cc.color

    ORDER BY SUM(t.amount) DESC

  ) x

)

  )

  INTO result;

  RETURN result;

EXCEPTION
  WHEN OTHERS THEN

    RETURN json_build_object(
      'error', SQLERRM,
      'sqlstate', SQLSTATE
    );

END;