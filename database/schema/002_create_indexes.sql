-- ============================================
-- Performance Indexes
-- ============================================

-- Users indexes
CREATE NONCLUSTERED INDEX IX_Users_Email ON [dbo].[Users]([Email]);
CREATE NONCLUSTERED INDEX IX_Users_AzureAdB2CObjectId ON [dbo].[Users]([AzureAdB2CObjectId]);

-- Products indexes
CREATE NONCLUSTERED INDEX IX_Products_CategoryId ON [dbo].[Products]([CategoryId]);
CREATE NONCLUSTERED INDEX IX_Products_SKU ON [dbo].[Products]([SKU]);
CREATE NONCLUSTERED INDEX IX_Products_IsActive ON [dbo].[Products]([IsActive]) WHERE [IsActive] = 1;

-- Orders indexes
CREATE NONCLUSTERED INDEX IX_Orders_UserId ON [dbo].[Orders]([UserId]);
CREATE NONCLUSTERED INDEX IX_Orders_OrderDate ON [dbo].[Orders]([OrderDate] DESC);
CREATE NONCLUSTERED INDEX IX_Orders_Status ON [dbo].[Orders]([Status]);

-- OrderItems indexes
CREATE NONCLUSTERED INDEX IX_OrderItems_OrderId ON [dbo].[OrderItems]([OrderId]);
CREATE NONCLUSTERED INDEX IX_OrderItems_ProductId ON [dbo].[OrderItems]([ProductId]);

-- Shopping Cart indexes
CREATE NONCLUSTERED INDEX IX_ShoppingCart_UserId ON [dbo].[ShoppingCart]([UserId]);

-- Audit Log indexes
CREATE NONCLUSTERED INDEX IX_AuditLog_Timestamp ON [dbo].[AuditLog]([Timestamp] DESC);
CREATE NONCLUSTERED INDEX IX_AuditLog_UserId ON [dbo].[AuditLog]([UserId]);

GO