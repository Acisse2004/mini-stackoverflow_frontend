// Bouton réutilisable avec variantes
export default function Button({
  children, variant = 'ghost', onClick,
  disabled = false, type = 'button',
  fullWidth = false, style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      style={{ width: fullWidth ? '100%' : undefined, justifyContent: fullWidth ? 'center' : undefined, ...style }}
    >
      {children}
    </button>
  )
}