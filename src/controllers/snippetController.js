import { prisma } from "../lib/prisma.js";

export const createSnippet = async (req, res) => {
    const userId = Number(req.user.id); 
    const { title, description, framework, language } = req.body;

    if (!title || !description || !framework || !language) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Ada field yang kosong!"
        });
    }

    try {
        const snippet = await prisma.snippets.create({
            data: {
                owner: userId,
                title: title,
                description: description,
                framework: framework,
                language: language,
            },
            include: {
                users: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        return res.status(201).json({
            code: 201,
            success: true,
            message: "Snippet berhasil dibuat",
            data: snippet
        });
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message,
        });
    }
}

export const getSnippets = async (req, res) => {
    const userId = Number(req.user.id);

    try {
        const snippets = await prisma.snippets.findMany({
            where:{
                owner: userId
            }, include: {
                _count: {
                    select:{
                        snippets_files: true
                    }
                }
            }
        });
        return res.status(200).json({
            code: 200,
            success: true,
            message: "Snippets berhasil diambil",
            data: snippets
        });
    } catch (error) {
        console.error(error);
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
    }
}