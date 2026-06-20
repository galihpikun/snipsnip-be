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
    
    // 1. Ambil query parameter dari URL (misal: ?framework=Tailwind&language=html)
    const { framework, language } = req.query;

    try {
        const snippets = await prisma.snippets.findMany({
            where: {
                owner: userId,
                // 2. Tambahkan filter kondisional. 
                // Jika frontend tidak mengirimkannya, filter ini otomatis diabaikan oleh Prisma.
                framework: framework ? framework : undefined,
                language: language ? language : undefined,
            }, 
            include: {
                _count: {
                    select: {
                        snippets_files: true
                    }
                }
            },
            // Opsional: urutkan dari yang paling baru dibuat
            orderBy: {
                created_at: 'desc'
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
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message,
        });
    }
}

export const updateSnippet = async (req, res) => {
    const userId = Number(req.user.id);
    const { id } = req.params; // Mengambil ID snippet dari URL (misal: /api/snippets/:id)
    const { title, description, framework, language } = req.body;

    if (!title || !description || !framework || !language) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Ada field yang kosong!"
        });
    }

    try {
        // 1. Cari snippet-nya dulu untuk memastikan kepemilikan
        const existingSnippet = await prisma.snippets.findUnique({
            where: { id: id }
        });

        if (!existingSnippet) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "Snippet tidak ditemukan"
            });
        }

        if (existingSnippet.owner !== userId) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: "Kamu tidak berhak mengubah snippet ini!"
            });
        }

        // 3. Eksekusi update data
        const updatedSnippet = await prisma.snippets.update({
            where: { id: id },
            data: {
                title,
                description,
                framework,
                language
            }
        });

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Snippet berhasil diperbarui",
            data: updatedSnippet
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

export const deleteSnippet = async (req, res) => {
    const userId = Number(req.user.id);
    const { id } = req.params; // Mengambil ID snippet dari URL

    try {
        // 1. Cari snippet-nya dulu
        const existingSnippet = await prisma.snippets.findUnique({
            where: { id: id }
        });

        if (!existingSnippet) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "Snippet tidak ditemukan"
            });
        }

        // 2. Proteksi: Cek apakah yang hapus adalah pemiliknya
        if (existingSnippet.owner !== userId) {
            return res.status(403).json({
                code: 403,
                success: false,
                message: "Kamu tidak berhak menghapus snippet ini!"
            });
        }

        // 3. Eksekusi hapus
        await prisma.snippets.delete({
            where: { id: id }
        });

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Snippet beserta file di dalamnya berhasil dihapus"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
};

export const getSnippetById = async (req,res) => {
    const snippetId = req.params.id;

    try {
        const snippet = await prisma.snippets.findUnique({
            where: { id: snippetId },
            include: {
                snippets_files: true,
                users: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            }
        });

        return res.status(200).json({
            code:200,
            success:true,
            message:"Snippet berhasil diambil",
            data : snippet
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: "Terjadi kesalahan pada server",
            error: error.message
        });
    }
}