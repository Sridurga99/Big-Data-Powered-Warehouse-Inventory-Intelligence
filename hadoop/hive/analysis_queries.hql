USE warehouse_inventory;

SET hive.auto.convert.join=false;

SELECT
    s.product_id,
    p.product_name,
    SUM(s.quantity) AS total_quantity
FROM sales s
JOIN products p
ON s.product_id = p.product_id
WHERE s.product_id <> 'product_id'
  AND p.product_id <> 'product_id'
GROUP BY s.product_id, p.product_name
ORDER BY s.product_id;
