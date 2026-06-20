import { prisma } from "../lib/prisma.js";

export const getUserById = async (req,res) => {
    const userId = Number(req.params.id);

    try {
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        if  (!user) {
            return res.status(404).json({
                code: 404,
                success: false,
                message: "User tidak ditemukan"
            });
        }

        return res.status(200).json({
            code: 200,
            success: true,
            message: "User berhasil diambil",
            data: user
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
}