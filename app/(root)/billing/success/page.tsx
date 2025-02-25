"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useUserId } from "@/app/hooks/useUserId";

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const { data: session } = useSession(); 
    const userid = useUserId();
    console.log(userid);

    useEffect(() => {
        const updateSubscription = async () => {
            if (!session?.user?.id) return;

            const userId = userid
            const plan = searchParams.get("plan");
            const price = searchParams.get("price");
            const startDate = searchParams.get("startDate");
            const endDate = searchParams.get("endDate");

            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, plan, price, startDate, endDate }),
            });

            if (res.ok) {
                console.log("Subscription updated, refreshing session...");
                
            }
        };

        updateSubscription();
    }, [session, searchParams, userid]);

    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold">Payment Successful! 🎉</h1>
            <p>Your subscription has been activated.</p>
        </div>
    );
};

export default SuccessPage;
