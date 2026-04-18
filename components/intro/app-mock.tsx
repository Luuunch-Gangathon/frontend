const SKUS = [
  { sku: 'SKU-A4291', company: "L'Oréal Paris" },
  { sku: 'SKU-B7733', company: 'Unilever' },
  { sku: 'SKU-C1029', company: 'Nestlé' },
  { sku: 'SKU-D8841', company: 'Procter & Gamble' },
  { sku: 'SKU-E3356', company: 'Henkel AG' },
  { sku: 'SKU-F5582', company: 'Beiersdorf' },
]

function SparkIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ color: 'oklch(0.205 0 0)' }}
    >
      <path d="M12 2l1.9 6.3L20 10l-6.1 1.7L12 18l-1.9-6.3L4 10l6.1-1.7L12 2z" />
      <path d="M19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.5" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: 'oklch(0.556 0 0)' }}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}

export function AppMock() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'oklch(1 0 0)',
        color: 'oklch(0.145 0 0)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'inherit',
      }}
    >
      {/* Header */}
      <header
        style={{
          borderBottom: '1px solid oklch(0.922 0 0)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          padding: '0 24px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '-0.015em',
              color: 'oklch(0.145 0 0)',
            }}
          >
            Spherecast
          </span>
          <span style={{ fontSize: '11px', color: 'oklch(0.556 0 0)', fontWeight: 400 }}>
            Supply Chain Co-Pilot
          </span>
        </div>

        <nav style={{ display: 'flex', gap: '2px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: 'oklch(0.145 0 0)',
              padding: '15px 10px 13px',
              borderBottom: '2px solid oklch(0.205 0 0)',
              lineHeight: 1,
            }}
          >
            Chat
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 400,
              color: 'oklch(0.556 0 0)',
              padding: '15px 10px 13px',
              lineHeight: 1,
            }}
          >
            Dictionary
          </span>
        </nav>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono, ui-monospace, monospace)',
              fontSize: '10px',
              fontWeight: 500,
              color: 'oklch(0.556 0 0)',
              padding: '3px 7px',
              borderRadius: '5px',
              background: 'oklch(0.97 0 0)',
              border: '1px solid oklch(0.922 0 0)',
            }}
          >
            ⌘K
          </span>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, oklch(0.75 0.08 264) 0%, oklch(0.55 0.12 264) 100%)',
            }}
          />
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          gap: '20px',
          background:
            'radial-gradient(circle at 50% 0%, oklch(0.98 0 0) 0%, oklch(1 0 0) 60%)',
        }}
      >
        {/* Hero */}
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 600,
              letterSpacing: '-0.025em',
              lineHeight: 1.1,
              margin: 0,
              color: 'oklch(0.145 0 0)',
            }}
          >
            Ask Agnes
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'oklch(0.556 0 0)',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Explore ingredient substitutions across the portfolio.
          </p>
        </div>

        {/* Product picker card */}
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            border: '1px solid oklch(0.922 0 0)',
            borderRadius: '14px',
            background: 'oklch(1 0 0)',
            padding: '18px',
            boxShadow:
              '0 1px 2px oklch(0 0 0 / 0.04), 0 8px 20px oklch(0 0 0 / 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'oklch(0.97 0 0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid oklch(0.922 0 0)',
                flexShrink: 0,
              }}
            >
              <SparkIcon />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '-0.01em' }}>
                Start a new chat
              </div>
              <div style={{ fontSize: '11px', color: 'oklch(0.556 0 0)', lineHeight: 1.4 }}>
                Select a product to ground the conversation.
              </div>
            </div>
          </div>

          {/* Search input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              border: '1px solid oklch(0.922 0 0)',
              borderRadius: '8px',
              padding: '8px 11px',
              background: 'oklch(1 0 0)',
            }}
          >
            <SearchIcon />
            <span style={{ fontSize: '12px', color: 'oklch(0.708 0 0)' }}>
              Search SKU or company…
            </span>
          </div>

          {/* SKU list */}
          <div
            style={{
              border: '1px solid oklch(0.922 0 0)',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {SKUS.map(({ sku, company }, i) => (
              <div
                key={sku}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 13px',
                  borderTop: i > 0 ? '1px solid oklch(0.95 0 0)' : 'none',
                  background: i === 0 ? 'oklch(0.98 0 0)' : 'transparent',
                }}
              >
                <code
                  style={{
                    fontFamily: 'var(--font-mono, ui-monospace, monospace)',
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: 'oklch(0.145 0 0)',
                  }}
                >
                  {sku}
                </code>
                <span style={{ fontSize: '11px', color: 'oklch(0.556 0 0)' }}>{company}</span>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: '10px',
              color: 'oklch(0.708 0 0)',
              textAlign: 'center',
            }}
          >
            Showing {SKUS.length} of 312 materials
          </div>
        </div>
      </main>
    </div>
  )
}
