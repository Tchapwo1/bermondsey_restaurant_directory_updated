import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <main className="flex flex-1 justify-center py-10">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-6">
            <section className="mb-12">
              <div className="bg-cover bg-center flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px] relative shadow-2xl" 
                style={{ backgroundImage: 'linear-gradient(0deg, rgba(34, 22, 16, 0.8) 0%, rgba(34, 22, 16, 0) 50%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAxqOPu0KGazzhF8eNwCze3dy0e26Y2Cq4024BTDipJFcCWqW6uFlGjoZgIEsXP0OXJhAS_08YlkkOt4kO99SWXbAVxOPtEGe4J4W1AW8Dqyp8NQw2-DJT8MqbZj1WvDHa3i_THwWAplA6KIbMpZub_N8BAAZsGtbAIma1tf2iQCyZH5GL_tqhx7px2BVlpbgE00jdoUeTh0iSgBQvh-hSdT0Iht7QOUJpnM5UWlbvAeyHL5HZFyaubEJOz2TLPZBRBZszKzV67s7VY")' }}>
                <div className="flex flex-col p-8 gap-2">
                  <h1 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight uppercase">Celebrating Bermondsey's Flavors</h1>
                  <p className="text-slate-200 text-lg max-w-2xl">A journey through the tastes, stories, and people that make SE1 the culinary heart of London.</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 py-8 border-b border-primary/10">
              <div className="flex flex-col gap-4">
                <h2 className="text-primary text-sm font-bold uppercase tracking-widest">Our Mission</h2>
                <p className="text-slate-900 dark:text-slate-100 text-4xl font-black leading-tight tracking-tight">Connecting Foodies with Local Craft.</p>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                  Bermondish started with a simple idea: to create a curated guide for the food-obsessed community in Bermondsey. We believe every corner of our neighborhood has a story to tell through its food.
                </p>
              </div>
              <div className="flex items-center">
                <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-slate-700 dark:text-slate-300 italic text-xl leading-relaxed">
                    "We don't just review restaurants; we celebrate the artisans, the bakers, and the brewers who bring Bermondsey to life every single morning."
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">JD</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">Julian Deville</p>
                      <p className="text-sm text-slate-500">Founder, Bermondish</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 bg-primary/5 -mx-6 px-6 md:px-12 rounded-3xl">
              <div className="flex flex-col items-center text-center gap-4 mb-12">
                <h2 className="text-slate-900 dark:text-slate-100 text-3xl font-bold tracking-tight uppercase">The Team</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-xl">Meet the local residents who spend their weekends exploring the Beer Mile and scouting the best brunch spots.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                <TeamMember name="Julian Deville" role="Founder & Chief Taster" img="https://lh3.googleusercontent.com/aida-public/AB6AXuCrlrFkp76-bOjHVabcJR6sjJ0VR0vjXNgQ8_9xsfndVpwTvx3B0uwNyCAXlJIeZgvyjt3buXFcsxN-nUm4SoQVSd31NmRkivRCZ57YzuPGfgTKjycEqwuwZgVNON8X7BRGO_pNf2fOcgGOsahPhZ8JBPiCiH0Ra8C1wCHkmfeYvjLyOCXUu2pJjwriP6sZ1rs0Z-6LDcCSkftkUnltEEO9nMFNCYnfZXoFFGB4J9MMSokN-3RYBU9CXM7eupj0IUmDlEOeOQwTXZdI" />
                <TeamMember name="Sarah Chen" role="Editorial Lead" img="https://lh3.googleusercontent.com/aida-public/AB6AXuBoGa67UktclU9QEWtyQqgxJ9b6pHh91Bv5egzZky2EdsXglaCMb4SyrDgEukmEReGpov11FRW8oQLyslF15MFKsAyo2M14NoTeHglbacdlSDv8rLcYyKHdyLxXf9yey31NDlvVnmDvSWe2Bqe0mv0YIPqGMN5V-RxSYEpEfETnYvjD3J6mGoYTOnKMmjmiiPnX5P7rGnWVYAfJWvsj2EgnljFFW9-y2wzqd9OYwoi571PSaJb8LjU1Ylr15Fhce6BUaFbCazz9uBUF" />
                <TeamMember name="Marcus Thorne" role="Head of Visuals" img="https://lh3.googleusercontent.com/aida-public/AB6AXuCvVlHTyDIabTnFTCP-0njeo1ZkUUw_b8kiBbGr5lrJtXScG4pn5HwDR183fmRbr6Je0YIc7BnLd9AQiSswL4VeHjFjjXMJc5MQzqhlwsPv1DkTaHBSOVeacuvxqtaloBRH5j_yn4Xcs7MXQItCVWcq0i5A7-kCCguzIckt4ucBn6fNJaqQj92JPhhjNznjZ11SSBIx0RpC2sBZfgGP5zyDRwCVKCjdbZv_F-8mQJyQOYJ42zLoJ7SfPQZnu6RxfpSXrDsTheJyRwAK" />
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

function TeamMember({ name, role, img }: any) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="size-32 rounded-full bg-cover bg-center border-4 border-white shadow-lg" style={{ backgroundImage: `url("${img}")` }}></div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{name}</h3>
      <p className="text-primary text-sm font-medium">{role}</p>
    </div>
  );
}
