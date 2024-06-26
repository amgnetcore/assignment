"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: "ID",
      },
      {
        accessorKey: "CompanyName",
        header: "Name",
      },
      {
        accessorKey: "RoC",
        header: "RoC",
      },
      {
        accessorKey: "CompanyStatus",
        header: "Status",
      },
      {
        accessorKey: "CompanyActivity",
        header: "Activity",
      },
      {
        accessorKey: "CIN",
        header: "CIN",
      },
      {
        accessorKey: "RegistrationDate",
        header: "Reg Date",
      },
      {
        accessorKey: "Category",
        header: "Category",
      },
      {
        accessorKey: "SubCategory",
        header: "Sub Category",
      },
      {
        accessorKey: "CompanyClass",
        header: "Class",
      },
      {
        accessorKey: "AuthorisedCapital",
        header: "Auth Capital",
      },
      {
        accessorKey: "PaidUpCapital",
        header: "Capital",
      },
      {
        accessorKey: "LastAnnualGeneralMeetingDate",
        header: "Meeting Date",
      },
      {
        accessorKey: "LatestDateOfBalanceSheet",
        header: "Balance Sheet",
      },
      {
        accessorKey: "State",
        header: "State",
      },
      {
        accessorKey: "PINCode",
        header: "PIN Code",
      },
      {
        accessorKey: "Country",
        header: "Country",
      },
      {
        accessorKey: "Address",
        header: "Address",
      },
      {
        accessorKey: "Email",
        header: "Email",
      },
      {
        accessorKey: "ContactPerson",
        header: "Contact ",
      },
      {
        accessorKey: "BusinessEmail",
        header: " Email",
      },
      {
        accessorKey: "BusinessAddress",
        header: "Address",
      },
      {
        accessorKey: "CompanyShortName",
        header: " Short Name",
      }
    ]      
