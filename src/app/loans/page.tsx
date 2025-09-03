'use client';
import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import LoanAddButton from "./loan-button";
import LoanModal from "./add-loan-modal";





export default function LoansPage() {
    const [openModel, setOpenModel] = useState(false);

    const addLoanButtonClick = () => {
        setOpenModel(true);
    }
    return (
        <div className="space-y-6">
            <PageHeader
                title="Loans"
                subtitle="Overview of your debt activity"
                gradient
                actions={
                    <>
                        <LoanAddButton text="Add Loan" onClick={addLoanButtonClick} />
                    </>
                }
            />
            {openModel && <LoanModal />}

        </div >
    );
}