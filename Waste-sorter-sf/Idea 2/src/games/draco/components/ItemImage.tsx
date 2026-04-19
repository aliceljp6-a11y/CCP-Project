import { useEffect, useState } from 'react'

type ItemImageProps = {
  src?: string
  alt: string
  className?: string
  placeholderLabel: string
}

/** Clean-folder item art only: no fallback to unclean `/assets/items/`. */
export function ItemImage({ src, alt, className, placeholderLabel }: ItemImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!src || failed) {
    return (
      <div className="draco-img-placeholder" role="img" aria-label={placeholderLabel}>
        <span>{placeholderLabel}</span>
      </div>
    )
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  )
}
