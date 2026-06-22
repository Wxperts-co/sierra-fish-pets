import OrderModel from "@/models/Order";

/**
 * Links previous unlinked guest orders to a newly authenticated user account.
 * This operation is fully idempotent and safe to run multiple times.
 * 
 * @param email - The user's verified email address (case-insensitive)
 * @param userId - The user's database object identifier (_id)
 * @returns Object indicating status and number of linked orders
 */
export async function linkGuestOrders(
  email: string,
  userId: string
): Promise<{ success: boolean; modifiedCount: number }> {
  if (!email || !userId) {
    return { success: false, modifiedCount: 0 };
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const result = await OrderModel.updateMany(
      {
        guestEmail: normalizedEmail,
        $or: [
          { userId: null },
          { userId: { $exists: false } }
        ]
      },
      {
        $set: { userId }
      }
    );

    return {
      success: true,
      modifiedCount: result.modifiedCount
    };
  } catch (error) {
    console.error(`Failed to link guest orders for email: ${normalizedEmail}`, error);
    return { success: false, modifiedCount: 0 };
  }
}
