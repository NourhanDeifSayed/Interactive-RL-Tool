export const styles = {
  app: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: 'relative'
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    padding: '16px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    padding: '8px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: 0,
    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 0 0'
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0',
    padding: '24px',
    marginBottom: '20px',
    transition: 'all 0.3s ease'
  },
  cardHover: {
    boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
    transform: 'translateY(-2px)'
  },
  sectionHeader: {
    marginBottom: '24px'
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: '0 0 8px 0'
  },
  sectionDescription: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    lineHeight: 1.6
  },
  grid: {
    display: 'grid',
    gap: '20px'
  },
  gridCols2: {
    gridTemplateColumns: 'repeat(2, 1fr)'
  },
  gridCols3: {
    gridTemplateColumns: 'repeat(3, 1fr)'
  },
  gridCols4: {
    gridTemplateColumns: 'repeat(4, 1fr)'
  },
  button: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  buttonPrimary: {
    backgroundColor: '#1976d2',
    color: 'white'
  },
  buttonPrimaryHover: {
    backgroundColor: '#1565c0',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)'
  },
  buttonSuccess: {
    backgroundColor: '#2e7d32',
    color: 'white'
  },
  buttonSuccessHover: {
    backgroundColor: '#1b5e20',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(46, 125, 50, 0.3)'
  },
  buttonWarning: {
    backgroundColor: '#f57c00',
    color: 'white'
  },
  buttonWarningHover: {
    backgroundColor: '#e65100',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(245, 124, 0, 0.3)'
  },
  buttonSecondary: {
    backgroundColor: '#616161',
    color: 'white'
  },
  buttonSecondaryHover: {
    backgroundColor: '#424242',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(97, 97, 97, 0.3)'
  },
  buttonDanger: {
    backgroundColor: '#d32f2f',
    color: 'white'
  },
  buttonDangerHover: {
    backgroundColor: '#b71c1c',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(211, 47, 47, 0.3)'
  },
  environmentCard: {
    textAlign: 'left',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    borderStyle: 'solid',
    position: 'relative',
    overflow: 'hidden'
  },
  environmentCardSelected: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)'
  },
  environmentCardHover: {
    borderColor: '#bdbdbd',
    backgroundColor: '#f5f5f5',
    transform: 'translateY(-2px)'
  },
  environmentCardContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    position: 'relative',
    zIndex: 1
  },
  environmentIcon: {
    padding: '8px',
    borderRadius: '6px',
    backgroundColor: '#f5f5f5',
    transition: 'all 0.2s ease'
  },
  environmentIconSelected: {
    backgroundColor: '#bbdefb',
    transform: 'scale(1.1)'
  },
  environmentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  environmentDescription: {
    fontSize: '14px',
    color: '#666',
    margin: '4px 0 0 0'
  },
  parameterSlider: {
    marginBottom: '20px'
  },
  sliderLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  sliderText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  sliderValue: {
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: '#f5f5f5',
    padding: '4px 8px',
    borderRadius: '4px',
    minWidth: '60px',
    textAlign: 'center'
  },
  slider: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    backgroundColor: '#e0e0e0',
    outline: 'none',
    WebkitAppearance: 'none',
    transition: 'all 0.2s ease'
  },
  sliderThumb: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#1976d2',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  sliderDescription: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
    fontStyle: 'italic'
  },
  canvasContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    width: '100%',
    position: 'relative',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
  },
  canvas: {
    width: '100%',
    height: '100%',
    objectFit: 'contain'
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '16px'
  },
  statusItem: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    transition: 'all 0.2s ease'
  },
  statusItemHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  statusLabel: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 8px 0',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  statusValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginTop: '12px',
    overflow: 'hidden',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1976d2',
    transition: 'width 0.3s ease',
    background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
    borderRadius: '4px'
  },
  valueGrid: {
    backgroundColor: '#f8f9fa',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '16px',
    border: '1px solid #e0e0e0'
  },
  valueGridInner: {
    display: 'grid',
    gap: '4px'
  },
  valueCell: {
    aspectRatio: '1/1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontFamily: 'monospace',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  valueCellHover: {
    transform: 'scale(1.05)',
    zIndex: 1,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  legend: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '24px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e0e0e0'
  },
  legendColor: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  legendText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333'
  },
  legendSubtext: {
    fontSize: '12px',
    color: '#666'
  },
  footer: {
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e0e0e0',
    padding: '32px 0',
    marginTop: '32px',
    boxShadow: '0 -2px 4px rgba(0,0,0,0.05)'
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#666',
    margin: 0
  },
  algorithmInfoCard: {
    backgroundColor: '#e3f2fd',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #bbdefb',
    marginBottom: '16px',
    position: 'relative',
    overflow: 'hidden'
  },
  algorithmInfoCardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(25, 118, 210, 0.15)'
  },
  algorithmInfoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  algorithmInfoDescription: {
    fontSize: '14px',
    color: '#1976d2',
    marginBottom: '16px',
    lineHeight: 1.6
  },
  formula: {
    backgroundColor: 'white',
    padding: '16px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    marginBottom: '16px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#1a1a1a',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  formulaText: {
    margin: 0
  },
  algorithmFeatures: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#1976d2'
  },
  algorithmFeature: {
    marginBottom: '8px',
    lineHeight: 1.4,
    position: 'relative'
  },
  algorithmFeatureBullet: {
    position: 'absolute',
    left: '-15px',
    top: '6px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#1976d2'
  },
  metricsContainer: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    marginTop: '20px'
  },
  metricsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  metricsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: 0
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '12px'
  },
  metricItem: {
    backgroundColor: 'white',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
    textAlign: 'center'
  },
  metricLabel: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  metricValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1976d2',
    margin: 0
  },
  chartContainer: {
    width: '100%',
    height: '200px',
    position: 'relative',
    marginTop: '16px'
  },
  controlPanel: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    border: '1px solid #f0f0f0'
  },
  controlGroup: {
    marginBottom: '24px'
  },
  controlTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};