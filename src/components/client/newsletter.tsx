import Heading from './heading'

interface NewsletterSignUpProps {
   isOnBlogsPage?: boolean
}

function NewsletterSignUp({ isOnBlogsPage }: NewsletterSignUpProps) {
   return (
      <section className={`text-black ${isOnBlogsPage ? 'mt-0' : 'my-24'} bg-primary/30 `}>
         <div className="text-center space-y-8 sm:min-w-[420px] sm:p-16 p-8">
            {isOnBlogsPage ? (
               <h2 className="text-3xl max-w-80 text-center headingFont mx-auto font-bold flex flex-col">
                  <span className="whitespace-nowrap">Get the “World Pumps”</span>
                  <span className="whitespace-nowrap">newsletter in your inbox</span>
               </h2>
            ) : (
               <Heading
                  title="World Pumps Newsletter"
                  summary="Subscribe for the latest updates on water pumps, pool solutions, and
          exclusive offers."
               />
            )}

            <form
               className={`flex gap-1 justify-center ${isOnBlogsPage ? 'flex-col' : 'flex-col sm:flex-row max-w-xl mx-auto'}`}
            >
               <input
                  type="email"
                  placeholder="xyz@gmail.com"
                  className="w-full px-4 py-2.5 text-foreground placeholder:text-sm focus:outline-none border border-secondary/30 shadow-xs text-sm  focus:border-ring bg-white"
                  required
               />
               <button
                  type="button"
                  className="bg-secondary text-white font-medium px-6 py-3 hover:bg-secondary/80 text-sm transition-all"
               >
                  Subscribe
               </button>
            </form>
            <p
               className={`${isOnBlogsPage ? 'max-w-80' : 'max-w-full'} text-secondary/90 mx-auto text-center`}
            >
               No spam. Just the highest quality insights you&apos;ll find on the web.
            </p>
         </div>
      </section>
   )
}

export default NewsletterSignUp
