import os
import requests
import mysql.connector

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="mern_user",  # Change if needed
    password="your_password",  # Change if needed
    database="bookshop"
)
cursor = db.cursor()

# Fetch book titles
cursor.execute("SELECT title FROM book")
books = cursor.fetchall()

# Ensure folder exists and check permissions
image_folder = "book_covers"
try:
    os.makedirs(image_folder, exist_ok=True)
    print(f"✅ Folder {image_folder} is ready.")
except Exception as e:
    print(f"❌ Failed to create folder {image_folder}: {e}")
    exit(1)  # Exit if folder creation fails

# Function to sanitize filenames (remove special characters)
def clean_filename(title):
    return "".join(c for c in title if c.isalnum() or c in (" ", "-")).rstrip()

# Function to get cover image URL
def get_cover_url(title):
    search_url = f"https://openlibrary.org/search.json?title={title}"
    response = requests.get(search_url)
    
    if response.status_code == 200:
        data = response.json()
        docs = data.get("docs", [])
        if docs:
            cover_id = docs[0].get("cover_i")
            if cover_id:
                return f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
    return None

# Fetch and save covers
for (title,) in books:
    cover_url = get_cover_url(title)
    sanitized_title = clean_filename(title)
    image_path = os.path.join(image_folder, f"{sanitized_title}.jpg")

    print(f"Saving image to: {image_path}")  # Add this line to print the path

    if cover_url:
        try:
            # Check if the image already exists
            if not os.path.exists(image_path):
                img_data = requests.get(cover_url).content
                with open(image_path, "wb") as f:
                    f.write(img_data)
                print(f"✅ Saved cover for '{title}'")
            else:
                print(f"⚠️ Cover already exists for '{title}', skipping download.")
        except Exception as e:
            print(f"❌ Error saving cover for '{title}': {e}")
    else:
        print(f"❌ No cover found for '{title}'")

# Close database connection
cursor.close()
db.close()
