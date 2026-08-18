"use client"
import { useState } from "react"
const BookEvent = () => {


    const [email, setemail] = useState('')
    const [submitted, setsubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setTimeout(() => {
          setsubmitted(true)
        }, 1000);
    }

  return (
    <div id="book-event">
        {submitted ? (
            <p className="text-sm"> 
            Thank You for signing up !
            </p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email"> Email Address</label>
                    <input type="email" id="email" placeholder="Enter Your Email" onChange={(e) => setemail(e.target.value)} />
                </div>

                <button type="submit" className="button-submit">SUBMIT</button>
            </form>
        )
    
    }
        </div>
  )
}

export default BookEvent