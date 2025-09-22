import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, IndianRupee } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import BackDrop from '@/components/ui/backdrop';
import ModalAnimation from '@/components/ui/modal-animation';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { formatCurrency } from '@/lib/currency';

// AmountField.tsx
import { useState, useEffect } from "react";


function SelectTypeOfDate({ selectedValue, onChange, options, ...props }: { onChange?: any, selectedValue?: string, options?: { [key: string]: string } }) {
    return (
        <div className='mt-2'>
            <Select
                value={selectedValue}
                onValueChange={onChange}
                {...props}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                    {options && Object.entries(options).map(([key, value]) => (
                        <SelectItem key={key} value={key}>{value}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function MyIcons({ iconType }: { iconType: String }) {
    const classes = {
        iconClasses: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
    }
    switch (iconType) {
        case 'loan':
            return <img src="loan.svg" alt="Icon" className={classes.iconClasses} />
        case 'rupee':
            return <IndianRupee className={classes.iconClasses} />
        default:
            return <IndianRupee className={classes.iconClasses} />
    }

}

function formatINR(n?: number) {
    if (n === undefined || Number.isNaN(n)) return "";
    return n.toLocaleString("en-IN");
}
function parseDigits(s: string) {
    const d = s.replace(/[^\d]/g, "");
    return d ? Number(d) : undefined;
}

type AmountFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label?: string;
    placeholder?: string;
};

export function AmountField<T extends FieldValues>({
    control,
    name,
    label = "Amount",
    placeholder = "28,00,000",
}: AmountFieldProps<T>) {
    const [display, setDisplay] = useState("");

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState }) => {
                // keep local display in sync when RHF value changes externally
                useEffect(() => {
                    setDisplay(field.value ? formatINR(Number(field.value)) : "");
                }, [field.value]);

                return (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">{label}</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                inputMode="numeric"
                                placeholder={placeholder}
                                className="pl-10 text-lg font-semibold"
                                value={display}
                                onChange={(e) => {
                                    const num = parseDigits(e.target.value);
                                    setDisplay(e.target.value);        // show what user typed (before blur)
                                    field.onChange(num ?? undefined);  // keep RHF numeric
                                }}
                                onBlur={(e) => {
                                    const num = parseDigits(e.target.value);
                                    setDisplay(num !== undefined ? formatINR(num) : "");
                                    field.onBlur();
                                }}
                            />
                        </div>
                        {fieldState.error && (
                            <p className="text-sm font-medium text-red-500">{fieldState.error.message}</p>
                        )}
                    </div>
                );
            }}
        />
    );
}

function ModalFormInput({ name, label, placeholder, type, defaultValue, value, icon, customClass, errors, ...props }: { name?: string, label?: string, placeholder?: string, type?: string, defaultValue?: string, value?: any, customClass?: string, icon?: string, errors?: any }) {
    return (
        <div className='space-y-2'>
            <Label className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <div className='relative'>
                {icon && <MyIcons iconType={icon} />}
                <Input
                    placeholder={placeholder}
                    // onChange={(e) => console.log(e.target.value)}
                    className={`pl-10 text-lg font-semibold bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 ${customClass}`}
                    type={type}
                    // defaultValue={defaultValue}
                    // value={value}
                    name={name}
                    {...props}
                />
            </div>
            {errors ? errors[name] && <p className="text-sm text font-medium">{errors[name].message}</p> : ''}
        </div>
    )
}

function ModalHeader({ closeModal }) {
    return (
        <CardHeader className='pb-4'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                    <div className="p-2 rounded-lg bg-primary/10">
                        <img src="loan.svg" alt="Icon" className='w-12' />
                    </div>
                    <CardTitle className='text-xl font-bold text-foreground'>Add Your Loan</CardTitle>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeModal}
                    className="hover:bg-primary/10 hover:text-primary rounded-full"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
    )
}

const loanSchema = z.object({
    loanName: z.string().min(1),
    lenderName: z.string().min(1, 'Who did you borrow the loan from?'),
    roi: z.number().positive("I'm sure you have to pay the interest, not the bank"),
    loanDuration: z.string().min(1, 'Macha, seriously?'),
    roiDuration: z.string().min(1, "Don't play with me!"),
    loanStartDate: z.date({ error: 'When did you crushing debt start?' }),
    amount: z.number().positive(),
    duration: z.number().positive('It must be positive'),

});

type LoanFormData = z.infer<typeof loanSchema>;


export default function LoanModal({ openModal, closeModal }) {

    const { register, formState: { errors }, watch, reset, handleSubmit, control } = useForm<LoanFormData>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            loanStartDate: new Date(),
        },
    });

    const amount = watch('amount');

    const handleClose = () => {
        reset();
        closeModal();
    }

    const onSubmit = async (data: any) => {
        console.log("Data", data)
    }
    const classes = {
        wrapper: "fixed inset-0 z-50 bg-opacity-25 backdrop-blur flex items-center justify-center p-4",
        cardContentWrapper: "glass-morphism dark:glass-morphism-dark border border-border/30 shadow-elegant backdrop-blur-xl",
        inputSelectWrapper: 'flex flex-col-2 items-end gap-1',
        buttonAlign: 'flex flex-col-2 items-end justify-between gap-1',
    }

    return (
        <AnimatePresence>
            {openModal && <>
                <BackDrop onClick={handleClose} />

                <div className={classes.wrapper}>
                    <ModalAnimation>
                        <Card className={classes.cardContentWrapper}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <ModalHeader closeModal={handleClose} />
                                <CardContent className='space-y-4'>
                                    <ModalFormInput name={'loanName'} label='Loan Name' placeholder='Home Loan...' icon={"loan"} {...register('loanName')} errors={errors} />
                                    {/* <ModalFormInput name={'amount'} label='Amount' placeholder='28,00,000' type='number' icon='rupee' {...register('amount', { valueAsNumber: true })} />
                                    {amount && amount > 0 && (
                                        <p className="text-sm text-primary font-medium">
                                            {formatCurrency(amount)}
                                        </p>
                                    )} */}
                                    <AmountField control={control} name={"amount"} />
                                    <ModalFormInput label='Bank / Lender' placeholder='Cred' {...register('lenderName')} errors={errors} name='lenderName' />

                                    <div className={classes.inputSelectWrapper}>
                                        <ModalFormInput label='Rate Of Interest' placeholder='8' type='number' customClass="w-[100] !important pl-5" {...register('roi', { valueAsNumber: true })} errors={errors} name='roi' />
                                        <span className='text-xl'>%</span>

                                        <Controller name="roiDuration" control={control} render={({ field, fieldState }) => (
                                            <div>
                                                <SelectTypeOfDate selectedValue={field.value} options={{ "month": "Per Month", "year": "Per Year" }} onChange={field.onChange} />
                                                {fieldState.error && (
                                                    <p className="text-sm text font-medium">
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </div>
                                        )} />
                                    </div>

                                    <ModalFormInput label='Start Date' name='loanStartDate' type='date' {...register('loanStartDate', { valueAsDate: true })} errors={errors} />

                                    <div className={classes.inputSelectWrapper}>
                                        <ModalFormInput label='Duration' placeholder="36" type='number' {...register('duration', { valueAsNumber: true })} />
                                        <Controller name="loanDuration" control={control} render={({ field, fieldState }) => (
                                            <div>
                                                <SelectTypeOfDate selectedValue={field.value} options={{ "month": "Months", "year": "Years" }} onChange={field.onChange} />
                                                {fieldState.error && (
                                                    <p className="text-sm text font-medium">
                                                        {fieldState.error.message}
                                                    </p>
                                                )}
                                            </div>
                                        )} />
                                    </div>

                                    <div className='flex flex-row items-center gap-2'>
                                        <input type='checkbox' className='w-4.5 h-4.5 accent-primary' />
                                        <Label> Is Loan Active </Label>
                                    </div>
                                    <div className={classes.buttonAlign}>
                                        <Button variant='default' type='submit'>Calculate Details</Button>
                                        <Button variant='outline' onClick={handleClose}>Cancel</Button>
                                    </div>

                                </CardContent>
                            </form>
                        </Card>
                    </ModalAnimation>
                </div>

            </>}
        </AnimatePresence>
    );
}