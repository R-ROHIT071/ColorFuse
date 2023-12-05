import React, { useState } from 'react';
import { Button, Container, Row, Col, Navbar, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaFileAlt, FaEdit, FaInfoCircle } from 'react-icons/fa';
import '../styles/poster.css';
import { useDispatch } from 'react-redux';




const Poster = () => {

  const [generatedImages, setGeneratedImages] = useState([]);
  const [imageData, setImageData] = useState()

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const posterEndpoint = '/poster';

  const dispatch = useDispatch();

  // State variables for form inputs
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [titleH, setTitltH] = useState('null')
  const [regen, setRegen] = useState(false)
  const [error, setError] = useState(null)

  // Function to handle image generation
  const handleGenerate = (images) => {
    setGeneratedImages(images);
  };

  // Function to convert base64 string to Blob
  const base64ToBlob = (base64String, contentType) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };


  // Function to handle Poster generation
  const handleGenerateParty = async () => {
    setError(null);
    
    if (!title.trim()) {
      setIsTitleValid(false);
      return;
    }

    try {
      setIsTitleValid(true);
      setLoading(true);

      const response = await fetch( `${backendUrl}${posterEndpoint}` , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, location, time }),
      });

      const data = await response.json();

      setImageData(data.results)

      if (data.success) {
        console.log('Success:');

        const images = await Promise.all(data.results.map(async (result, index) => {
          try {
            const blob = await base64ToBlob(result.data, result.type);
            const imageURL = URL.createObjectURL(blob);
            return imageURL;
          } catch (error) {
            console.error(`Error creating URL for Image ${index + 1}:`, error);
            throw error;
          }
        }));

        handleGenerate(images);
        setRegen(true);
        setTitltH(title);

      } else {
        console.error('Error during party generation:', data.error);
      }
    } catch (error) {
      console.error('Error during party generation:', error.message);
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  // ImageShowcase component
  const ImageShowcase = ({ images }) => {
    const navigate = useNavigate();

    const handleImageClick = (index) => {
      const clickedImageData = imageData[index]
      localStorage.setItem('title', title);
      localStorage.setItem('time', time);

      dispatch({ type: 'SET_IMAGE_BASE64', payload: clickedImageData });
      dispatch({ type: 'SET_POSTER_VAL', payload: true });
      const userId = localStorage.getItem('UID');
      
      if (userId === null || userId === undefined || userId.trim() === '') {
        navigate('/signup');
      }else{
        navigate('/postercanvas')
      }
    };

    return (
      <div style={{ marginTop: '70px', textAlign: 'center', fontSize: '26px' }}>
        {images.length > 0 && <p>Select a design</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
          {images.map((imageBlob, index) => (
            <div key={index} style={{ margin: '10px', flexBasis: '30%' }}>
              <img
                src={imageBlob}
                alt={`Image ${index + 1}`}
                style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => handleImageClick(index)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };


  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="/images/logo.jpg"
              width="30"
              height="30"
              className="d-inline-block align-top"
              style={{ borderRadius: '100%', marginRight: '10px' }}
            />{' '}
            ColorFuse
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div>
        {/* PartyForm component */}
        <div className="head2">
          <h1>Welcome to AI poster!</h1>
          <p>Give breif descriptions and generate stunning visuals.</p>
        </div>
        <div className="blurry-image2"></div>
        <div className="form-container">
          <Form className="pform">
            {error &&(<p style={{ color: 'red' }}>{error}</p>)}
            <Form.Group controlId="formTitle">
              <Form.Label>
                <FaFileAlt /> Title :
              </Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="EX: Halloween Party (required)" />
              {!isTitleValid && <p style={{ color: 'red', marginTop: '5px' }}>Title is required.</p>}
            </Form.Group>

            <Form.Group controlId="formLocation">
              <Form.Label>
                <FaInfoCircle /> Additional details :
              </Form.Label>
              <Form.Control type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="EX: Haunted Atmosphere, Fog, and Mystical Lights" />
            </Form.Group>

            <Form.Group controlId="formTime">
              <Form.Label>
                <FaEdit /> Any other text to be placed :
              </Form.Label>
              <Form.Control type="text" value={time} onChange={(e) => setTime(e.target.value)} placeholder="EX: Dress Code Black" />
            </Form.Group>

            {titleH === title ? (
            <Button variant={regen ? 'secondary' : 'primary'} onClick={handleGenerateParty} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : regen ? 'Regenerate' : 'Generate'}
            </Button>
          ) : (
            <Button variant="primary" onClick={handleGenerateParty} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Generate'}
            </Button>
          )}
          </Form>
        </div>
        {/* ImageShowcase component */}
        <ImageShowcase images={generatedImages} />
      </div>
      <footer className="footer mt-5 text-center">
        <Container>
          <Row>
            <Col md={12}>
              <span>&copy; 2023 ColorFuse. All rights reserved. </span>
              <img src="/images/logo.jpg" alt="Your Company Logo" className="logo" />
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default Poster;




