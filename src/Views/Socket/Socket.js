import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function BasicExample() {
  return (
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Link Gir</Form.Label>
        <Form.Control placeholder="Linki Girin" />
        <Form.Text className="text-muted">
          Hadi bir link paylaşın !
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Gönder
      </Button>
    </Form>
  );
}

export default BasicExample;