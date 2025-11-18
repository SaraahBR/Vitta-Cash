import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { email, senha } = await request.json();

    // Validações básicas
    if (!email || !senha) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const usuario = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        image: true,
        emailVerified: true,
      },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Verificar se o usuário tem senha (pode ter sido criado via Google)
    if (!usuario.password) {
      return NextResponse.json(
        { error: 'Esta conta foi criada com Google. Use o login do Google.' },
        { status: 400 }
      );
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.password);

    if (!senhaValida) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        userId: usuario.id,
        email: usuario.email,
      },
      process.env.NEXTAUTH_SECRET || 'seu-secret-aqui',
      { expiresIn: '30d' }
    );

    // Remover senha do objeto de resposta
    const { password, ...usuarioSemSenha } = usuario;

    return NextResponse.json(
      {
        message: 'Login realizado com sucesso',
        token,
        usuario: usuarioSemSenha,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login. Tente novamente.' },
      { status: 500 }
    );
  }
}
