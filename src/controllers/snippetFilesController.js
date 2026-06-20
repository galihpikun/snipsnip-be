import { prisma } from "../lib/prisma.js";

export const getSnippetFiles = async (req, res) => {
    const { id } = req.params; 

    try {
        const snippetData = await prisma.snippets.findUnique({
            where: { id: id },
            include: {
                snippets_files: true // Mengambil semua snippet file yang nyambung
            }
        });

        if (!snippetData) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "Snippet tidak ditemukan"
            });
        }

        // Dipisahin biar rapih le
        const { title, description, framework, language, snippets_files } = snippetData;

        return res.status(200).json({
            code: 200,
            success: true,
            message: "Berhasil mengambil data snippet beserta file",
            data: {
                title,
                description,
                framework,
                language,
                files: snippets_files 
            }
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

export const createSnippetFile = async (req, res) => {
    const { id } = req.params; 
    const { filename, language, content } = req.body;

    if (!filename) {
        return res.status(400).json({
            code: 400,
            success: false,
            message: "Nama file tidak boleh kosong!"
        });
    }

    try {
        // cek keberadaan eksistensi snip snip nya le
        const snippetExists = await prisma.snippets.findUnique({
            where: { id: id }
        });

        if (!snippetExists) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "Snippet parent tidak ditemukan"
            });
        }

       
        const newFile = await prisma.snippets_files.create({
            data: {
                snippet_id: id,
                filename,
                language, // Optional 
                content   // Optional 
            }
        });

        return res.status(201).json({
            code: 201,
            success: true,
            message: "File snippet baru berhasil ditambahkan",
            data: newFile
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

export const updateSnippetFile = async (req, res) => {
    const { id } = req.params;
    const { filename, language, content } = req.body;

    try {

        const existingFile = await prisma.snippets_files.findUnique({
            where: { id: id }
        });

        if (!existingFile) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "File snippet tidak ditemukan"
            });
        }

        const updatedFile = await prisma.snippets_files.update({
            where: { id: id },
            data: {
                filename: filename !== undefined ? filename : existingFile.filename,
                language: language !== undefined ? language : existingFile.language,
                content: content !== undefined ? content : existingFile.content
            }
        });

        return res.status(200).json({
            code: 200,
            success: true,
            message: "File snippet berhasil diperbarui",
            data: updatedFile
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


export const deleteSnippetFile = async (req, res) => {
    const { id } = req.params; 

    try {
        const existingFile = await prisma.snippets_files.findUnique({
            where: { id: id }
        });

        if (!existingFile) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "File snippet tidak ditemukan"
            });
        }

        await prisma.snippets_files.delete({
            where: { id: id }
        });

        return res.status(200).json({
            code: 200,
            success: true,
            message: "File snippet berhasil dihapus"
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