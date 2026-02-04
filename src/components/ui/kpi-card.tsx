import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KPICardProps {
    title: string
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
    isLoading: boolean
    value?: string | number
}

function KPICard({ title, isLoading, value, icon: Icon }: KPICardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="text-muted-foreground h-4 w-4" />}
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="bg-muted h-8 w-20 animate-pulse rounded" />
                ) : (
                    <>
                        <div className="text-2xl font-bold">{value || 0}</div>
                    </>
                )}
            </CardContent>
        </Card>
    )
}

export default KPICard
