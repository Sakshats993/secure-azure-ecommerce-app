-- ============================================
-- Sample Data for Testing
-- ============================================

-- Insert Categories
INSERT INTO [dbo].[Categories] ([CategoryName], [Description], [ImageUrl])
VALUES 
    ('Electronics', 'Electronic devices and accessories', 'https://via.placeholder.com/150'),
    ('Computers', 'Laptops, desktops, and peripherals', 'https://via.placeholder.com/150'),
    ('Accessories', 'Computer accessories and gadgets', 'https://via.placeholder.com/150'),
    ('Software', 'Software and licenses', 'https://via.placeholder.com/150');

-- Insert Products
INSERT INTO [dbo].[Products] ([CategoryId], [ProductName], [Description], [Price], [StockQuantity], [SKU], [ImageUrl])
VALUES 
    (2, 'Dell XPS 15 Laptop', 'High-performance laptop with 15.6" display, Intel i7, 16GB RAM', 1499.99, 25, 'LAPTOP-DELLXPS15', 'https://via.placeholder.com/300'),
    (2, 'MacBook Pro 14"', 'Apple M2 Pro chip, 16GB RAM, 512GB SSD', 1999.99, 15, 'LAPTOP-MBP14', 'https://via.placeholder.com/300'),
    (2, 'HP Pavilion Desktop', 'Desktop computer with Intel i5, 8GB RAM, 512GB SSD', 799.99, 30, 'DESKTOP-HPPAV', 'https://via.placeholder.com/300'),
    (3, 'Logitech MX Master 3', 'Advanced wireless mouse for productivity', 99.99, 100, 'MOUSE-LOGMX3', 'https://via.placeholder.com/300'),
    (3, 'Mechanical Keyboard RGB', 'Gaming keyboard with RGB lighting', 129.99, 50, 'KEYBOARD-MECHRGB', 'https://via.placeholder.com/300'),
    (3, 'USB-C Hub 7-in-1', 'Multi-port USB-C adapter', 49.99, 200, 'HUB-USBC7', 'https://via.placeholder.com/300'),
    (1, 'Wireless Headphones', 'Noise-cancelling Bluetooth headphones', 249.99, 75, 'AUDIO-WLHEADPHONE', 'https://via.placeholder.com/300'),
    (1, '4K Webcam', 'High-definition webcam for streaming', 149.99, 60, 'WEBCAM-4K', 'https://via.placeholder.com/300'),
    (3, 'Laptop Stand Aluminum', 'Ergonomic adjustable laptop stand', 39.99, 150, 'STAND-LAPTOP', 'https://via.placeholder.com/300'),
    (4, 'Microsoft Office 365', '1-year subscription for Office suite', 69.99, 500, 'SOFTWARE-OFFICE365', 'https://via.placeholder.com/300');

GO