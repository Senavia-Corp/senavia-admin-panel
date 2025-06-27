interface UserAvatarProps {
  src?: string
  name: string
  size?: "sm" | "md" | "lg"
}

export function UserAvatar({ src, name, size = "md" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-lg",
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center text-white font-medium`}
    >
      {src ? (
        <img src={src || "/placeholder.svg"} alt={name} className="w-full h-full rounded-full object-cover" />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  )
}
