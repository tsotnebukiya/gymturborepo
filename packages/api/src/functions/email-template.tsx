interface EmailTemplateProps {
  userName: string;
  userEmail: string;
  message: string;
  generationId?: string;
}

const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  userName,
  userEmail,
  message,
  generationId,
}) => (
  <div
    style={{
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#ffffff',
    }}
  >
    <div
      style={{
        backgroundColor: '#f8f9fa',
        padding: '24px',
        borderRadius: '12px',
        border: '1px solid #e9ecef',
      }}
    >
      <h1
        style={{
          color: '#1a1a1a',
          fontSize: '24px',
          marginBottom: '24px',
          borderBottom: '2px solid #e9ecef',
          paddingBottom: '12px',
        }}
      >
        New Support Request
      </h1>

      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '8px',
          }}
        >
          User Information
        </h2>
        <p style={{ margin: '4px 0', color: '#333' }}>
          <strong>Name:</strong> {userName}
        </p>
        <p style={{ margin: '4px 0', color: '#333' }}>
          <strong>Email:</strong> {userEmail}
        </p>
        {generationId && (
          <p style={{ margin: '4px 0', color: '#333' }}>
            <strong>Generation ID:</strong> {generationId}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '8px',
          }}
        >
          Message
        </h2>
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            whiteSpace: 'pre-wrap',
            color: '#333',
            lineHeight: '1.5',
          }}
        >
          {message}
        </div>
      </div>

      <div
        style={{
          fontSize: '12px',
          color: '#666',
          marginTop: '24px',
          textAlign: 'center' as const,
          borderTop: '1px solid #e9ecef',
          paddingTop: '12px',
        }}
      >
        This is an automated message from the support system.
      </div>
    </div>
  </div>
);

export default EmailTemplate;
