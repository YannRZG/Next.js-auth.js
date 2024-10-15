// app/api/cart/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour récupérer le panier de l'utilisateur
async function getCart(userId: string) {
  console.log(`Fetching cart for userId: ${userId}`);
  return await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: { product: true }
      }
    }
  });
}

// Fonction pour ajouter un produit au panier
async function addToCart(userId: string, productId: string, quantity: number = 1) {
  console.log(`Adding to cart - userId: ${userId}, productId: ${productId}, quantity: ${quantity}`);

  // Vérifie si l'utilisateur existe
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  // Vérifie si l'utilisateur a déjà un panier
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  // Si le panier n'existe pas, le créer
  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        user: { connect: { id: userId } } // Connecter le panier à l'utilisateur
      },
      include: { items: true }
    });
  }

  // Vérifie si le produit est déjà dans le panier
  const existingItem = cart.items.find(item => item.productId === productId);

  if (existingItem) {
    // Si le produit est déjà dans le panier, met à jour la quantité
    return await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    // Si le produit n'est pas dans le panier, l'ajouter
    return await prisma.cartItem.create({
      data: {
        cart: { connect: { id: cart.id } },
        product: { connect: { id: productId } },
        quantity,
      }
    });
  }
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier
async function updateCartItem(userId: string, productId: string, quantity: number) {
  console.log(`Updating cart item - userId: ${userId}, productId: ${productId}, quantity: ${quantity}`);
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  const item = cart?.items.find(item => item.productId === productId);

  if (!item) {
    console.error('Item not found in cart');
    throw new Error('Item not found in cart');
  }

  return await prisma.cartItem.update({
    where: { id: item.id },
    data: { quantity },
  });
}

// Fonction pour supprimer un produit du panier
async function removeFromCart(userId: string, productId: string) {
  console.log(`Removing from cart - userId: ${userId}, productId: ${productId}`);
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!cart) {
    console.error('Cart not found');
    throw new Error('Cart not found');
  }

  const item = cart.items.find(item => item.productId === productId);

  if (!item) {
    console.error('Item not found in cart');
    throw new Error('Item not found in cart');
  }

  return await prisma.cartItem.delete({
    where: { id: item.id },
  });
}

// Fonction pour vider le panier
async function clearCart(userId: string) {
  console.log(`Clearing cart for userId: ${userId}`);
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!cart) {
    console.error('Cart not found');
    throw new Error('Cart not found');
  }

  return await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
}

// Gestion des routes
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const cart = await getCart(userId);
    return NextResponse.json({
      id: cart?.id, // Assurez-vous que vous renvoyez l'ID du panier ici
      items: cart?.items || []
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId, productId, quantity } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
  }

  try {
    const item = await addToCart(userId, productId, quantity);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const { userId, productId, quantity } = await req.json();

  if (!userId || !productId || quantity === undefined) {
    return NextResponse.json({ error: 'User ID, Product ID, and quantity are required' }, { status: 400 });
  }

  try {
    const item = await updateCartItem(userId, productId, quantity);
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');

  if (!userId || !productId) {
    return NextResponse.json({ error: 'User ID and Product ID are required' }, { status: 400 });
  }

  try {
    await removeFromCart(userId, productId);
    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Fonction pour vider le panier
export async function CLEAR(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await clearCart(userId);
    return NextResponse.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
