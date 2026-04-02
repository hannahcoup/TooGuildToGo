SELECT
    b.id,
    b.description,
    b.category,
    b.price,
    b.quantity,
    b.collection_time,
    b.status,
    v.name AS vendor_name,
    v.location AS vendor_location
FROM bags b
JOIN vendors v
    ON b.vendor_id = v.id
WHERE b.status = 'available'
  AND b.quantity > 0
ORDER BY b.collection_time ASC;
