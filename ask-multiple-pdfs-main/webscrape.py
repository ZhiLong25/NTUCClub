import requests
from bs4 import BeautifulSoup
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph
import json

# Function to scrape website
def scrape_website(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes
        html = BeautifulSoup(response.text, 'html.parser')

        my_data = []
        
        # Extract JSON-LD structured data
        json_ld_script = html.find("script", type="application/ld+json")
        if json_ld_script:
            json_ld_data = json.loads(json_ld_script.string)
            if isinstance(json_ld_data, dict):
                offers = json_ld_data.get("offers", [])
                for offer in offers:
                    data = {
                        "price": offer.get("price", ""),
                        "priceCurrency": offer.get("priceCurrency", ""),
                        "url": offer.get("url", ""),
                        "description": offer.get("description", ""),
                        "itemName": offer.get("itemOffered", {}).get("name", ""),
                        "category": offer.get("itemOffered", {}).get("category", ""),
                        "areaServed": offer.get("itemOffered", {}).get("areaServed", "")
                    }
                    my_data.append(data)
            else:
                print("Invalid JSON-LD format.")
        else:
            print("No JSON-LD data found on the page.")
        
        return my_data
        
    except Exception as e:
        print(f"Error occurred while scraping website: {e}")
        return []

# Function to create PDF
def create_pdf(data, filename):
    try:
        doc = SimpleDocTemplate(filename, pagesize=letter)
        styles = getSampleStyleSheet()
        content = []

        for item in data:
            price = item.get("price", "")
            currency = item.get("priceCurrency", "")
            url = item.get("url", "")
            description = item.get("description", "")
            itemName = item.get("itemName", "")
            category = item.get("category", "")
            areaServed = item.get("areaServed", "")

            # Construct the paragraph string
            paragraph_text = f"Price: {price} {currency}\n" \
                             f"URL: {url}\n" \
                             f"Description: {description}\n" \
                             f"Item Name: {itemName}\n" \
                             f"Category: {category}\n" \
                             f"Area Served: {areaServed}\n"

            # Create a Paragraph object and add it to the content list
            content.append(Paragraph(paragraph_text, styles["Normal"]))
        doc.build(content)
        print(f"PDF file '{filename}' created successfully.")
    except Exception as e:
        print(f"Error occurred while creating PDF: {e}")

# URL to scrape
url = 'https://www.uplay.com.sg/allexperiences/allexperiences'


# Scrape the website
scraped_data = scrape_website(url)

# Create PDF
pdf_filename = 'scraped_data.pdf'
print("Scraped data:", scraped_data)  # Add this line to check the scraped data

create_pdf(scraped_data, pdf_filename)
