"use client"

import { useEffect, useState } from "react"

type Ver = { version: string; deployedAt?: string }

export default function VersionBadge() {
  const [ver, setVer] = useState<Ver | null>(null)

  useEffect(() => {
    let active = true
    fetch("/api/version")
      .then((r) => r.json())
      .then((data: Ver) => {
        if (active) setVer(data)
      })
      .catch(() => {
        // If the endpoint fails, still show at least the label
        setVer({ version: "v100" })
      })
    return () => {
      active = false
    }
  }, [])

  const label = ver?.version ?? "v100"
  const when = ver?.deployedAt ? new Date(ver.deployedAt).toLocaleString() : undefined

  return (
    <div className="fixed bottom-3 left-3 z-[1000]" aria-live="polite" aria-atomic="true">
      <span className="inline-flex items-center rounded-full border bg-white/90 px-2 py-1 text-xs text-gray-700 shadow">
        {label}
        {when && <span className="ml-2 hidden sm:inline text-gray-400">{when}</span>}
      </span>
    </div>
  )
}
