"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Controller, type Control, type FieldValues, type Path, type FieldErrors } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ImageIcon, X, Upload } from "lucide-react"

interface ImageUploadFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  label: string
  errors: FieldErrors<T>
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export default function ImageUploadField<T extends FieldValues>({
  name,
  control,
  label,
  errors,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/gif"],
}: ImageUploadFieldProps<T>) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          validate: {
            fileType: (file: FileList | undefined) =>
              !file ||
              !file[0] ||
              acceptedTypes.includes(file[0].type) ||
              `Please upload a valid image file (${acceptedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")})`,
            fileSize: (file: FileList | undefined) =>
              !file ||
              !file[0] ||
              file[0].size <= maxSizeMB * 1024 * 1024 ||
              `Image size must be less than ${maxSizeMB}MB`,
          },
        }}
        render={({ field: { onChange, value, ...field } }) => (
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsDragging(false)

                const files = e.dataTransfer.files
                if (files?.length) {
                  onChange(files)
                }
              }}
            >
              {value && value[0] ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(value[0]) || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-auto rounded-md max-h-64 object-contain mx-auto"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChange(undefined)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="mb-3 rounded-full bg-primary/10 p-3">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mb-2 text-sm font-medium">
                    <span className="text-primary">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {acceptedTypes.map((t) => t.split("/")[1].toUpperCase()).join(", ")} (Max: {maxSizeMB}MB)
                  </p>
                </div>
              )}

              <Input
                id={name}
                type="file"
                accept={acceptedTypes.join(",")}
                className={`hidden`}
                onChange={(e) => {
                  const files = e.target.files
                  if (files?.length) {
                    onChange(files)
                  }
                }}
                {...field}
              />
            </div>

            {!value && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  document.getElementById(name)?.click()
                }}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Image
              </Button>
            )}

            {errors[name] && <p className="text-destructive text-sm">{errors[name]?.message?.toString()}</p>}
          </div>
        )}
      />
    </div>
  )
}

