-- ============================================
-- Secure E-Commerce Database Schema
-- ============================================

-- Enable encryption (Transparent Data Encryption is enabled by default in Azure SQL)

-- Users Table
CREATE TABLE [dbo].[Users] (
    [UserId] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [AzureAdB2CObjectId] NVARCHAR(100) UNIQUE NOT NULL,
    [Email] NVARCHAR(255) NOT NULL,
    [FirstName] NVARCHAR(100),
    [LastName] NVARCHAR(100),
    [PhoneNumber] NVARCHAR(20),
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [IsActive] BIT DEFAULT 1,
    CONSTRAINT UQ_Users_Email UNIQUE ([Email])
);

-- Categories Table
CREATE TABLE [dbo].[Categories] (
    [CategoryId] INT PRIMARY KEY IDENTITY(1,1),
    [CategoryName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(500),
    [ImageUrl] NVARCHAR(500),
    [IsActive] BIT DEFAULT 1,
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE()
);

-- Products Table
CREATE TABLE [dbo].[Products] (
    [ProductId] INT PRIMARY KEY IDENTITY(1,1),
    [CategoryId] INT FOREIGN KEY REFERENCES [dbo].[Categories]([CategoryId]),
    [ProductName] NVARCHAR(200) NOT NULL,
    [Description] NVARCHAR(2000),
    [Price] DECIMAL(10, 2) NOT NULL CHECK ([Price] >= 0),
    [StockQuantity] INT NOT NULL CHECK ([StockQuantity] >= 0),
    [ImageUrl] NVARCHAR(500),
    [SKU] NVARCHAR(50) UNIQUE NOT NULL,
    [IsActive] BIT DEFAULT 1,
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 DEFAULT GETUTCDATE()
);

-- Orders Table
CREATE TABLE [dbo].[Orders] (
    [OrderId] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Users]([UserId]),
    [OrderDate] DATETIME2 DEFAULT GETUTCDATE(),
    [TotalAmount] DECIMAL(10, 2) NOT NULL,
    [Status] NVARCHAR(50) NOT NULL DEFAULT 'Pending',
    [ShippingAddress] NVARCHAR(500),
    [PaymentMethod] NVARCHAR(50),
    [PaymentStatus] NVARCHAR(50) DEFAULT 'Pending',
    [CreatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    [UpdatedAt] DATETIME2 DEFAULT GETUTCDATE(),
    CONSTRAINT CK_Orders_Status CHECK ([Status] IN ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'))
);

-- Order Items Table
CREATE TABLE [dbo].[OrderItems] (
    [OrderItemId] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [OrderId] UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Orders]([OrderId]) ON DELETE CASCADE,
    [ProductId] INT FOREIGN KEY REFERENCES [dbo].[Products]([ProductId]),
    [Quantity] INT NOT NULL CHECK ([Quantity] > 0),
    [UnitPrice] DECIMAL(10, 2) NOT NULL,
    [Subtotal] AS ([Quantity] * [UnitPrice]) PERSISTED
);

-- Shopping Cart Table
CREATE TABLE [dbo].[ShoppingCart] (
    [CartId] UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    [UserId] UNIQUEIDENTIFIER FOREIGN KEY REFERENCES [dbo].[Users]([UserId]),
    [ProductId] INT FOREIGN KEY REFERENCES [dbo].[Products]([ProductId]),
    [Quantity] INT NOT NULL CHECK ([Quantity] > 0),
    [AddedAt] DATETIME2 DEFAULT GETUTCDATE(),
    CONSTRAINT UQ_Cart_User_Product UNIQUE ([UserId], [ProductId])
);

-- Audit Log Table (for security monitoring)
CREATE TABLE [dbo].[AuditLog] (
    [AuditId] BIGINT PRIMARY KEY IDENTITY(1,1),
    [UserId] UNIQUEIDENTIFIER,
    [Action] NVARCHAR(100) NOT NULL,
    [TableName] NVARCHAR(100),
    [RecordId] NVARCHAR(100),
    [OldValue] NVARCHAR(MAX),
    [NewValue] NVARCHAR(MAX),
    [IpAddress] NVARCHAR(50),
    [UserAgent] NVARCHAR(500),
    [Timestamp] DATETIME2 DEFAULT GETUTCDATE()
);

GO