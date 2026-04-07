import React, { useEffect, useState } from 'react';

interface BookCardProps {
  title: string;
  authors: string[];
  imageBlob: Blob | null;
}

const BookCard: React.FC<BookCardProps> = ({ title, authors, imageBlob }) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageBlob]);

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} style={styles.image} />
        ) : (
          <div style={styles.placeholder}>Нет обложки</div>
        )}
      </div>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.authors}>{authors.join(', ')}</p>
    </div>
  );
};

const styles = {
  card: {
    width: '200px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    backgroundColor: '#fff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    width: '150px',
    height: '220px',
    marginBottom: '10px',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  placeholder: {
    paddingTop: '80px',
    fontSize: '12px',
    color: '#888',
  },
  title: {
    fontSize: '18px',
    margin: '10px 0 5px 0',
    fontWeight: 'bold' as const,
  },
  authors: {
    fontSize: '14px',
    color: '#555',
    margin: 0,
  },
};

export default BookCard;