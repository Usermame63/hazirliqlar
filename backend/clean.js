// Yeni Prisma yaratmırıq, layihədəki hazır işləyən bağlantını çağırırıq
const prisma = require('./db');

async function main() {
  console.log("🧹 Təmizlik prosesi başlayır...");

  try {
    // 1. Qeyri-admin rəylərini silirik
    const deletedFeedbacks = await prisma.feedback.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });
    console.log(`- ${deletedFeedbacks.count} ədəd istifadəçi rəyi silindi.`);

    // 2. Qeyri-admin istifadəçiləri silirik
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });
    
    console.log(`✅ Təmizlik bitdi! Cəmi ${deletedUsers.count} qeyri-admin istifadəçi sistemdən tamamilə silindi.`);
    console.log("Yalnız ADMIN hesabları qaldı.");

  } catch (error) {
    console.error("❌ Xəta baş verdi:", error);
  } finally {
    // Bağlantını bağlayırıq
    await prisma.$disconnect();
  }
}

main();