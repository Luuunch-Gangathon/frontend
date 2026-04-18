import React from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowHref?: (row: T) => string
  className?: string
  emptyMessage?: string
}

export function DataTable<T,>({
  columns,
  rows,
  getRowHref,
  className,
  emptyMessage = "No data",
}: DataTableProps<T>) {
  return (
    <div className={cn("rounded-lg border border-border overflow-hidden", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => {
              const href = getRowHref?.(row)
              return (
                <TableRow key={i} className={href ? "cursor-pointer" : undefined}>
                  {columns.map((col, j) => (
                    <TableCell key={col.key}>
                      {href && j === 0 ? (
                        <Link href={href} className="font-medium hover:underline">
                          {col.render(row)}
                        </Link>
                      ) : (
                        col.render(row)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
