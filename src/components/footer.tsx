export default function Footer() {
  return (
    <footer className="flex flex-col px-4 sm:px-[5%] mt-8 pt-8 mb-8 border-t border-t-primary">
      {/* Heading */}
      <h3 className="mb-3 text-base font-normal text-gray-600">Follow us on</h3>
      <section className="flex justify-between items-start">
        {/* Social Icons */}
        <ul className="flex flex-row gap-6 lg:gap-11">
          {/* Instagram */}
          <li>
            <a
              href="https://www.instagram.com/etonshirts/"
              aria-label="Visit our Instagram account"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0B1130"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23.977 7.056c-.057-1.275-.263-2.152-.558-2.912a5.86 5.86 0 0 0-1.388-2.128A5.9 5.9 0 0 0 19.907.633C19.143.338 18.271.13 16.996.075 15.71.015 15.303 0 12.045 0 8.786 0 8.378.014 7.098.07 5.823.127 4.946.333 4.187.628a5.86 5.86 0 0 0-2.129 1.388A5.9 5.9 0 0 0 .675 4.14C.38 4.904.174 5.776.117 7.05.057 8.336.042 8.744.042 12.002c0 3.259.014 3.667.07 4.947.057 1.275.263 2.151.559 2.911a5.9 5.9 0 0 0 1.387 2.129c.6.61 1.327 1.083 2.124 1.383.764.295 1.636.501 2.912.558 1.28.056 1.688.07 4.946.07s3.666-.014 4.946-.07c1.276-.057 2.152-.263 2.912-.558a6.14 6.14 0 0 0 3.511-3.512c.296-.764.502-1.636.558-2.911.056-1.28.07-1.688.07-4.947 0-3.258-.004-3.666-.06-4.946M12.045 5.837a6.167 6.167 0 0 0-6.166 6.165 6.167 6.167 0 0 0 6.166 6.166 6.167 6.167 0 0 0 6.165-6.166 6.167 6.167 0 0 0-6.165-6.165m0 10.165a4 4 0 1 1 .001-8 4 4 0 0 1-.001 8m6.409-8.97a1.44 1.44 0 1 0 0-2.878 1.44 1.44 0 0 0 0 2.879"
                />
              </svg>
            </a>
          </li>

          {/* YouTube */}
          <li>
            <a
              href="https://www.youtube.com/etonshirts"
              aria-label="Visit our YouTube account"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0B1130"
                  d="M23.506 5.682a3.04 3.04 0 0 0-2.116-2.158C19.512 3 12 3 12 3s-7.512 0-9.39.504C1.6 3.787.77 4.634.493 5.682 0 7.598 0 11.572 0 11.572s0 3.993.494 5.888A3.04 3.04 0 0 0 2.61 19.62c1.897.524 9.39.524 9.39.524s7.512 0 9.39-.505a3.04 3.04 0 0 0 2.116-2.157C24 15.565 24 11.59 24 11.59s.02-3.993-.494-5.909m-13.898 9.56V7.901l6.247 3.67z"
                />
              </svg>
            </a>
          </li>

          {/* TikTok */}
          <li>
            <a
              href="https://www.tiktok.com/@etonshirts"
              aria-label="Visit our TikTok account"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0B1130"
                  d="M22.075 6.01a6.05 6.05 0 0 1-3.654-1.222A6.06 6.06 0 0 1 16.005 0h-3.918v10.708l-.005 5.865a3.547 3.547 0 0 1-3.753 3.54 3.53 3.53 0 0 1-1.623-.498 3.55 3.55 0 0 1-1.733-2.989 3.55 3.55 0 0 1 4.672-3.419V9.228a8 8 0 0 0-1.13-.083A7.51 7.51 0 0 0 2.87 11.67a7.35 7.35 0 0 0-1.855 4.435 7.34 7.34 0 0 0 2.187 5.72q.337.333.708.618A7.5 7.5 0 0 0 8.515 24q.574 0 1.13-.083a7.5 7.5 0 0 0 4.184-2.093 7.34 7.34 0 0 0 2.201-5.22l-.02-8.76a9.906 9.906 0 0 0 6.076 2.065V6.009z"
                />
              </svg>
            </a>
          </li>

          {/* LinkedIn */}
          <li>
            <a
              href="https://se.linkedin.com/company/eton-of-sweden"
              aria-label="Visit our LinkedIn account"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0B1130"
                  d="M20.727 0H3.273A3.273 3.273 0 0 0 0 3.273v17.454A3.27 3.27 0 0 0 3.273 24h17.454A3.27 3.27 0 0 0 24 20.727V3.273A3.273 3.273 0 0 0 20.727 0M8.182 18.993a.506.506 0 0 1-.506.507H5.52a.506.506 0 0 1-.507-.507V9.955a.507.507 0 0 1 .507-.508h2.156a.507.507 0 0 1 .506.508zM6.597 8.59a2.045 2.045 0 1 1 0-4.09 2.045 2.045 0 0 1 0 4.09m12.854 10.437a.466.466 0 0 1-.466.466h-2.319a.464.464 0 0 1-.466-.466v-4.234c0-.633.186-2.77-1.654-2.77-1.425 0-1.715 1.462-1.773 2.12v4.89a.466.466 0 0 1-.46.466h-2.238a.466.466 0 0 1-.465-.466V9.915a.465.465 0 0 1 .465-.466h2.239a.466.466 0 0 1 .466.466v.788c.53-.795 1.313-1.406 2.986-1.406 3.707 0 3.682 3.461 3.682 5.362z"
                />
              </svg>
            </a>
          </li>

          {/* Facebook */}
          <li>
            <a
              href="https://www.facebook.com/etonshirts/"
              aria-label="Visit our Facebook account"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#0B1130"
                  d="M22.675 0H1.324C.593 0 0 .593 0 1.325v21.351C0 23.408.593 24 1.325 24H12.82v-9.281H9.703v-3.633h3.117V8.412c0-3.1 1.893-4.787 4.659-4.787 1.324 0 2.463.098 2.794.142v3.24h-1.907c-1.504 0-1.796.716-1.796 1.765v2.314h3.598l-.469 3.633H16.57V24h6.105c.732 0 1.325-.593 1.325-1.324V1.324C24 .593 23.407 0 22.675 0"
                />
              </svg>
            </a>
          </li>
        </ul>

        <p className="text-sm font-normal text-gray-600">
          © 2025 Linea - All rights reserved
        </p>
      </section>
    </footer>
  );
}
