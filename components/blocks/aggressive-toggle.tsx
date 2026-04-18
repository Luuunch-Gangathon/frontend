'use client'

import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface AggressiveToggleProps {
  nonAggressive: React.ReactNode
  aggressive: React.ReactNode
  className?: string
}

export function AggressiveToggle({ nonAggressive, aggressive, className }: AggressiveToggleProps) {
  return (
    <Tabs defaultValue="non-aggressive" className={cn("w-full", className)}>
      <TabsList className="mb-1">
        <TabsTrigger value="non-aggressive">Conservative</TabsTrigger>
        <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
      </TabsList>
      <TabsContent value="non-aggressive">{nonAggressive}</TabsContent>
      <TabsContent value="aggressive">{aggressive}</TabsContent>
    </Tabs>
  )
}
