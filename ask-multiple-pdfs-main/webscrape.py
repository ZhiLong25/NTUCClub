import requests
from bs4 import BeautifulSoup
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
# Function to scrape website
def scrape_website(url):
    try:
        # Initialize Selenium webdriver (make sure you have the appropriate browser driver installed)
        driver = webdriver.Chrome()  # Or Firefox(), depending on your browser
        
        driver.get(url)
        # Scroll down to the bottom of the page to load more content
        last_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(10)  # Adjust the time delay according to the page load speed
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height
        
        # Now that all content is loaded, parse it with BeautifulSoup
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        my_data = []
        
        # Extract JSON-LD structured data
        title_elements = soup.find_all("h5", class_="card-title mb-0 sort-title")
        price_elements = soup.find_all("div", class_="card-title doller")
        price_divs = soup.find_all("div", class_="d-flex footer-content")
        session_divs = soup.find_all("div", class_="card-title locat d-flex align-items-center mb-0")

        # Initialize a list to store extracted data
        my_data = []

        # Extract data for each title element
        for title_element in title_elements:
            # Extract title text
            title_text = title_element.get_text(strip=True)
            data = {"itemName": title_text}

            # Append data to the list
            my_data.append(data)

        # Extract data for each price element
        for price_element in price_elements:
            # Extract price text
            price_text = price_element.find("p").get_text(strip=True)
            # Append price data to the corresponding dictionary in my_data list
            my_data[price_elements.index(price_element)]["price"] = price_text

        # Extract data for each price div
        for price_div in price_divs:
            # Find all child elements of the div
            children = price_div.find_all(recursive=False)
            # Extract and concatenate the text from each child element with space between them
            combined_text = ' '.join(child.get_text(strip=True) for child in children)
            # Append description data to the corresponding dictionary in my_data list
            my_data[price_divs.index(price_div)]["Original"] = combined_text
        for session_div in session_divs:
            # Extract session text
            session_text = session_div.find("p").get_text(strip=True)
            # Append session data to the corresponding dictionary in my_data list
            my_data[session_divs.index(session_div)]["sessions"] = session_text
        # Print the extracted data
        for data in my_data:
            print(data)


        # json_ld_script = soup.find("script", type="application/ld+json")
        # if json_ld_script:
        #     json_ld_data = json.loads(json_ld_script.string)
        #     if isinstance(json_ld_data, dict):
        #         offers = json_ld_data.get("offers", [])
        #         for offer in offers:
        #             data = {
        #                 "price": offer.get("price", ""),
        #                 "priceCurrency": offer.get("priceCurrency", ""),
        #                 "url": offer.get("url", ""),
        #                 "description": offer.get("description", ""),
        #                 "itemName": offer.get("itemOffered", {}).get("name", ""),
        #                 "category": offer.get("itemOffered", {}).get("category", ""),
        #                 "areaServed": offer.get("itemOffered", {}).get("areaServed", "")
        #             }
        #             my_data.append(data)
        #     else:
        #         print("Invalid JSON-LD format.")
        # else:
        #     print("No JSON-LD data found on the page.")
        
        return my_data
        
    except Exception as e:
        print(f"Error occurred while scraping website: {e}")
        return []
    
    finally:
        driver.quit()

# Function to create PDF
def create_pdf(data, filename):
    try:
        doc = SimpleDocTemplate(filename, pagesize=letter)
        styles = getSampleStyleSheet()
        content = []

        for item in data:
            price = item.get("price", "")
            Original = item.get("Original", "")
            url = item.get("url", "")
            description = item.get("description", "")
            itemName = item.get("itemName", "")
            category = item.get("category", "")
            sessions = item.get("sessions", "")

            # Construct the paragraph string
            paragraph_text = f"Price: {price}\n" \
                             f"URL: {url}\n" \
                             f"Description: {description}\n" \
                             f"Item Name: {itemName}\n" \
                             f"Category: {category}\n" \
                             f"Original Price: {Original}\n" \
                             f"Sessions Available: {sessions}\n"

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
