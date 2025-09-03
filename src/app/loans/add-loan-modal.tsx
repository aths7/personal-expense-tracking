import { Input } from '@/components/ui/input';

function InputField({ label, placeholder }: { label?: string, placeholder?: string }) {
    return (
        <div className='flex flex-col items-left lg:items-center '>
            <span className='whitespace-nowrap'>{label}</span>
            <Input
                placeholder={placeholder}
                value={""}
                onChange={(e) => console.log(e.target.value)}
                className="pl-8"
            />
        </div>
    )
}

export default function LoanModal() {
    return (
        <div className="fixed inset-0 bg-opacity-25 backdrop-blur flex items-center justify-center ">
            <div className="bg-white  p-6 rounded-sm shadow-lg justify-items-center"> <div>Loan Model</div>
                <InputField label='Loan Name' placeholder='Home Loan...' />
                <InputField label='Amount' placeholder='28,00,000' />
                <InputField label='Loan Name' placeholder='Home Loan...' />
                <InputField label='Loan Name' placeholder='Home Loan...' />
                <InputField label='Loan Name' placeholder='Home Loan...' />
            </div>
        </div>
    );
}
