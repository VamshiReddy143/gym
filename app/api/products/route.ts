// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

interface Query {
    category?: string;
    name?: { $regex: string; $options: string };
  }

export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const url = new URL(request.url);
        const category = url.searchParams.get('category') || '';
        const search = url.searchParams.get('search') || ''; // Add search query param
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = parseInt(url.searchParams.get('limit') || '6', 10);

        // Build query
        const query: Query = {};
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive search

        // Fetch products with pagination
        const totalProducts = await Product.countDocuments(query);
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalProducts / limit);

        return NextResponse.json({
            success: true,
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                limit,
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch products', error: error },
            { status: 500 }
        );
    }
}

// POST route remains unchanged
export async function POST(request: NextRequest) {
    try {
        // const session = await getServerSession(authOptions);
        // if (!session || session.user.role !== 'admin') {
        //     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        // }

        await dbConnect();

        const body = await request.json();
        const { name, image, price, description, category } = body;

        if (!name || !image || !price || !description || !category) {
            return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 });
        }

        const product = new Product({ name, image, price, description, category });
        await product.save();

        return NextResponse.json({ success: true, product }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create product', error: error},
            { status: 500 }
        );
    }
}