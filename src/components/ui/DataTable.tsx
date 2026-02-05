 import { cn } from "@/lib/utils";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 
 export interface Column<T> {
   key: keyof T | string;
   header: string;
   className?: string;
   render?: (value: any, row: T) => React.ReactNode;
 }
 
 interface DataTableProps<T> {
   columns: Column<T>[];
   data: T[];
   className?: string;
   emptyMessage?: string;
 }
 
 export function DataTable<T extends Record<string, any>>({
   columns,
   data,
   className,
   emptyMessage = "No data available",
 }: DataTableProps<T>) {
   return (
     <div className={cn("card-elevated overflow-hidden", className)}>
       <div className="overflow-x-auto">
         <Table className="table-premium">
           <TableHeader>
             <TableRow className="bg-muted/50 hover:bg-muted/50">
               {columns.map((column) => (
                 <TableHead
                   key={String(column.key)}
                   className={cn("font-semibold text-foreground", column.className)}
                 >
                   {column.header}
                 </TableHead>
               ))}
             </TableRow>
           </TableHeader>
           <TableBody>
             {data.length === 0 ? (
               <TableRow>
                 <TableCell
                   colSpan={columns.length}
                   className="h-24 text-center text-muted-foreground"
                 >
                   {emptyMessage}
                 </TableCell>
               </TableRow>
             ) : (
               data.map((row, index) => (
                 <TableRow key={index} className="hover:bg-muted/30">
                   {columns.map((column) => (
                     <TableCell key={String(column.key)} className={column.className}>
                       {column.render
                         ? column.render(row[column.key as keyof T], row)
                         : row[column.key as keyof T]}
                     </TableCell>
                   ))}
                 </TableRow>
               ))
             )}
           </TableBody>
         </Table>
       </div>
     </div>
   );
 }