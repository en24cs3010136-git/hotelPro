import React, { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Star, Wifi, Waves, Utensils, Car, CalendarDays, Users, X, Menu, ArrowRight, ShieldCheck, BedDouble, LogIn, UserPlus, LogOut, ClipboardList } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const defaultPhoto = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200";

async function request(path, options = {}) {
  const token = localStorage.getItem("hotelpro_token");
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
}

function App() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("hotelpro_user") || "null"));
  const [modal, setModal] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [toast, setToast] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (city.trim()) params.set("city", city.trim());
      const data = await request(`/hotels?${params.toString()}`);
      setHotels(data.hotels || []);
    } catch (err) { notify(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadHotels(); }, []);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 3500); };
  const logout = () => {
    localStorage.removeItem("hotelpro_token"); localStorage.removeItem("hotelpro_user");
    setUser(null); setModal(null); notify("You have been logged out.");
  };
  const onAuth = (payload) => {
    localStorage.setItem("hotelpro_token", payload.token);
    localStorage.setItem("hotelpro_user", JSON.stringify(payload.user));
    setUser(payload.user); setModal(null); notify(`Welcome, ${payload.user.name}!`);
  };

  const cities = useMemo(() => [...new Set(hotels.map(h => h.city))], [hotels]);

  return <div className="app-shell">
    <header className="topbar">
      <a href="#" className="brand" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
        <span className="brand-mark">H<span>+</span></span><span>Hotel<span className="brand-light">Pro</span><small>STAYS MADE SIMPLE</small></span>
      </a>
      <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><Menu size={22}/></button>
      <nav className={mobileNav ? "nav-links open" : "nav-links"}>
        <a href="#stays" onClick={() => setMobileNav(false)}>Find a stay</a>
        <a href="#why" onClick={() => setMobileNav(false)}>Why HotelPro</a>
        {user && <button className="nav-text-button" onClick={() => { setModal("bookings"); setMobileNav(false); }}>My bookings</button>}
      </nav>
      <div className="nav-actions">
        {user ? <><span className="welcome">Hi, {user.name.split(" ")[0]}</span><button className="button button-outline small" onClick={logout}><LogOut size={15}/> Sign out</button></>
          : <><button className="button button-ghost small" onClick={() => setModal("login")}><LogIn size={15}/> Log in</button><button className="button button-dark small" onClick={() => setModal("register")}><UserPlus size={15}/> Sign up</button></>}
      </div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="eyebrow"><span className="eyebrow-line"></span> YOUR NEXT CHAPTER STARTS HERE</div>
          <h1>Stay somewhere<br/><em>extraordinary.</em></h1>
          <p>Thoughtfully chosen stays. Seamless booking.<br className="desktop-break"/> More time for the moments that matter.</p>
          <a href="#stays" className="hero-link">Explore stays <ArrowRight size={17}/></a>
        </div>
        <div className="hero-note"><span className="note-star">✳</span><span>Find your kind<br/>of getaway.</span></div>
      </section>

      <section className="search-wrap" aria-label="Search hotels">
        <form className="search-panel" onSubmit={(e) => { e.preventDefault(); loadHotels(); document.getElementById("stays")?.scrollIntoView({ behavior: "smooth" }); }}>
          <label className="search-field"><MapPin size={19}/><span><small>DESTINATION</small><input value={city} onChange={e => setCity(e.target.value)} placeholder="Where are you going?"/></span></label>
          <span className="search-divider"></span>
          <label className="search-field"><Search size={19}/><span><small>HOTEL OR AMENITY</small><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Pool, beach, city..."/></span></label>
          <button className="button button-accent search-submit" type="submit"><Search size={17}/> Search stays</button>
        </form>
      </section>

      <section id="stays" className="section stays-section">
        <div className="section-heading">
          <div><div className="eyebrow dark-eyebrow"><span className="eyebrow-line"></span> THE GOOD STAYS</div><h2>Find your perfect <em>place.</em></h2></div>
          <p>From city escapes to slow mornings by the sea,<br/>there's a stay for every kind of traveller.</p>
        </div>
        <div className="filter-row">
          <span className="results-count">{loading ? "Finding stays..." : `${hotels.length} handpicked ${hotels.length === 1 ? "stay" : "stays"}`}</span>
          <div className="city-filters"><button className={!city ? "chip active" : "chip"} onClick={() => { setCity(""); setTimeout(loadHotels, 0); }}>All destinations</button>{cities.map(c => <button key={c} className={city === c ? "chip active" : "chip"} onClick={() => { setCity(c); setTimeout(() => request(`/hotels?city=${encodeURIComponent(c)}`).then(d => setHotels(d.hotels || [])).catch(e => notify(e.message)), 0); }}>{c}</button>)}</div>
        </div>
        {loading ? <div className="loading-grid">{[1,2,3].map(n => <div className="skeleton" key={n}/>)}</div> :
          hotels.length ? <div className="hotel-grid">{hotels.map((hotel, i) => <HotelCard key={hotel._id} hotel={hotel} index={i} onOpen={() => { setSelectedHotel(hotel); setModal("hotel"); }}/>)}</div> :
          <div className="empty-state"><Search size={30}/><h3>No stays found</h3><p>Try a different destination or search term.</p><button className="button button-dark" onClick={() => { setSearch(""); setCity(""); setTimeout(loadHotels, 0); }}>Clear filters</button></div>}
      </section>

      <section id="why" className="why-section">
        <div className="why-copy"><div className="eyebrow"><span className="eyebrow-line"></span> THE HOTELPRO DIFFERENCE</div><h2>Travel well.<br/><em>Feel at home.</em></h2><p>We believe where you stay shapes how you experience a place. That's why HotelPro keeps every step simple, clear, and considered.</p><a href="#stays" className="text-link">Find your next stay <ArrowRight size={17}/></a></div>
        <div className="benefits">
          <Benefit icon={<ShieldCheck/>} title="Booking made simple" text="A clear, easy-to-use booking experience from search to confirmation."/>
          <Benefit icon={<BedDouble/>} title="Stays for every style" text="Explore handpicked hotels with rooms for solo trips, couples, and families."/>
          <Benefit icon={<ClipboardList/>} title="Your plans, in one place" text="View upcoming reservations and manage your bookings from your account."/>
        </div>
      </section>

      <section className="newsletter"><div><div className="eyebrow"><span className="eyebrow-line"></span> A LITTLE TRAVEL INSPIRATION</div><h2>Good places. <em>Good stories.</em></h2><p>Your next favourite stay is just a search away.</p></div><a href="#stays" className="button button-light">Explore hotels <ArrowRight size={17}/></a></section>
    </main>

    <footer className="footer"><a href="#" className="brand footer-brand"><span className="brand-mark">H<span>+</span></span><span>Hotel<span className="brand-light">Pro</span><small>STAYS MADE SIMPLE</small></span></a><span>© {new Date().getFullYear()} HotelPro. Built for better stays.</span><a href="#stays">Back to top ↑</a></footer>

    {toast && <div className="toast" role="status">{toast}<button onClick={() => setToast("")}><X size={15}/></button></div>}
    {modal === "login" && <AuthModal mode="login" onClose={() => setModal(null)} onAuth={onAuth} notify={notify} switchMode={setModal}/>}
    {modal === "register" && <AuthModal mode="register" onClose={() => setModal(null)} onAuth={onAuth} notify={notify} switchMode={setModal}/>}
    {modal === "hotel" && selectedHotel && <HotelModal hotel={selectedHotel} onClose={() => setModal(null)} user={user} notify={notify} onLogin={() => setModal("login")}/>}
    {modal === "bookings" && <BookingsModal onClose={() => setModal(null)} notify={notify}/>}
  </div>;
}

function HotelCard({ hotel, index, onOpen }) {
  const lowest = hotel.rooms?.length ? Math.min(...hotel.rooms.map(r => r.pricePerNight)) : 0;
  return <article className="hotel-card" style={{ animationDelay: `${index * 80}ms` }}>
    <button className="hotel-image-wrap" onClick={onOpen} aria-label={`View ${hotel.name}`}><img src={hotel.image || defaultPhoto} alt={hotel.name} className="hotel-image" onError={e => { e.currentTarget.src = defaultPhoto; }}/><span className="image-label">HOTELPRO PICK</span><span className="image-arrow"><ArrowRight size={18}/></span></button>
    <div className="hotel-info"><div className="hotel-location"><MapPin size={13}/>{hotel.city}</div><div className="hotel-title-row"><h3>{hotel.name}</h3><span className="rating"><Star size={14} fill="currentColor"/>{Number(hotel.rating || 4.2).toFixed(1)}</span></div><p className="hotel-description">{hotel.description}</p>
      <div className="amenities">{(hotel.amenities || []).slice(0,3).map(a => <span key={a}>{a}</span>)}</div>
      <div className="card-bottom"><div><small>ROOMS FROM</small><strong>{money(lowest)}<i> / night</i></strong></div><button className="button button-dark card-button" onClick={onOpen}>View stay <ArrowRight size={15}/></button></div>
    </div>
  </article>;
}
function Benefit({ icon, title, text }) { return <div className="benefit"><div className="benefit-icon">{icon}</div><div><h3>{title}</h3><p>{text}</p></div></div>; }

function AuthModal({ mode, onClose, onAuth, notify, switchMode }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true);
    try { const data = await request(`/auth/${mode === "login" ? "login" : "register"}`, { method: "POST", body: JSON.stringify(form) }); onAuth(data); }
    catch (err) { notify(err.message); } finally { setBusy(false); }
  };
  return <ModalShell onClose={onClose}><div className="auth-modal"><div className="modal-kicker">WELCOME TO HOTELPRO</div><h2>{mode === "login" ? "Good to see you." : "Your next stay awaits."}</h2><p>{mode === "login" ? "Log in to manage your bookings." : "Create an account and start exploring."}</p>
    <form onSubmit={submit} className="stack-form">{mode === "register" && <label>Full name<input required autoComplete="name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} placeholder="Your name"/></label>}<label>Email address<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="you@example.com"/></label><label>Password<input required minLength="6" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} value={form.password} onChange={e => setForm({...form, password:e.target.value})} placeholder="At least 6 characters"/></label><button disabled={busy} className="button button-accent full-button">{busy ? "Please wait..." : mode === "login" ? "Log in" : "Create account"} <ArrowRight size={16}/></button></form>
    <p className="switch-auth">{mode === "login" ? "New to HotelPro?" : "Already have an account?"} <button onClick={() => switchMode(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create an account" : "Log in"}</button></p>
  </div></ModalShell>;
}

function HotelModal({ hotel, onClose, user, notify, onLogin }) {
  const [roomType, setRoomType] = useState(hotel.rooms?.[0]?.type || "");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [busy, setBusy] = useState(false);
  const selected = hotel.rooms?.find(r => r.type === roomType);
  const nights = checkIn && checkOut && new Date(checkOut) > new Date(checkIn) ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000) : 0;
  const submit = async (e) => {
    e.preventDefault();
    if (!user) { notify("Please log in before booking."); onLogin(); return; }
    if (!nights) { notify("Please choose a check-out date after check-in."); return; }
    setBusy(true);
    try {
      await request("/bookings", { method: "POST", body: JSON.stringify({ hotelId: hotel._id, roomType, checkIn, checkOut, guests: Number(guests) }) });
      notify("Your stay is booked! View it in My bookings."); onClose();
    } catch (err) { notify(err.message); } finally { setBusy(false); }
  };
  const today = new Date().toISOString().slice(0,10);
  return <ModalShell onClose={onClose} wide><div className="hotel-modal">
    <div className="detail-photo"><img src={hotel.image || defaultPhoto} alt={hotel.name}/><button className="close-button over-image" onClick={onClose}><X size={19}/></button><span className="detail-rating"><Star size={14} fill="currentColor"/> {Number(hotel.rating || 4.2).toFixed(1)} guest rating</span></div>
    <div className="detail-content"><div className="hotel-location"><MapPin size={14}/>{hotel.city} · {hotel.address}</div><h2>{hotel.name}</h2><p className="detail-description">{hotel.description}</p>
      <div className="detail-amenities">{(hotel.amenities || []).map(a => <span key={a}><span className="amenity-dot">✳</span>{a}</span>)}</div>
      <h3 className="room-heading">Choose your room</h3>
      <form onSubmit={submit} className="booking-form">
        <div className="room-options">{(hotel.rooms || []).map(room => <label key={room.type} className={roomType === room.type ? "room-option selected" : "room-option"}><input type="radio" name="room" checked={roomType === room.type} onChange={() => setRoomType(room.type)}/><span><strong>{room.type}</strong><small>{room.description} · Up to {room.capacity} guests</small></span><b>{money(room.pricePerNight)}<small>/night</small></b></label>)}</div>
        <div className="booking-fields"><label><span><CalendarDays size={15}/> CHECK-IN</span><input required type="date" min={today} value={checkIn} onChange={e => setCheckIn(e.target.value)}/></label><label><span><CalendarDays size={15}/> CHECK-OUT</span><input required type="date" min={checkIn || today} value={checkOut} onChange={e => setCheckOut(e.target.value)}/></label><label><span><Users size={15}/> GUESTS</span><select value={guests} onChange={e => setGuests(e.target.value)}>{Array.from({length: selected?.capacity || 4}, (_,i) => i+1).map(n => <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>)}</select></label></div>
        <div className="booking-submit-row"><div><small>{nights ? `${nights} night${nights > 1 ? "s" : ""} · TOTAL` : "TOTAL PRICE"}</small><strong>{money(nights * (selected?.pricePerNight || 0))}</strong></div><button disabled={busy || !selected || !checkIn || !checkOut} className="button button-accent">{busy ? "Booking..." : "Confirm booking"} <ArrowRight size={16}/></button></div>
      </form>
    </div>
  </div></ModalShell>;
}

function BookingsModal({ onClose, notify }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => { request("/bookings/my").then(d => setBookings(d.bookings || [])).catch(e => notify(e.message)).finally(() => setLoading(false)); }, [refresh]);
  const cancel = async (id) => { try { await request(`/bookings/${id}/cancel`, { method: "PATCH" }); notify("Booking cancelled."); setRefresh(v => v+1); } catch(e) { notify(e.message); } };
  return <ModalShell onClose={onClose} wide><div className="bookings-modal"><div className="modal-kicker">YOUR TRAVEL PLANS</div><h2>My bookings<span className="heading-period">.</span></h2><p className="bookings-subtitle">All your stays, together in one place.</p>
    {loading ? <p>Loading your bookings...</p> : bookings.length ? <div className="booking-list">{bookings.map(b => <article className="booking-item" key={b._id}><img src={b.hotel?.image || defaultPhoto} alt={b.hotel?.name || "Hotel"}/><div className="booking-item-main"><span className={`status ${b.status}`}>{b.status}</span><h3>{b.hotel?.name || "Hotel"}</h3><p>{b.hotel?.city} · {b.roomType}</p><small>{new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()} · {b.nights} night(s) · {b.guests} guest(s)</small></div><div className="booking-item-price"><strong>{money(b.totalPrice)}</strong>{b.status === "confirmed" && new Date(b.checkIn) > new Date() && <button onClick={() => cancel(b._id)}>Cancel booking</button>}</div></article>)}</div> : <div className="empty-state small-empty"><BedDouble size={30}/><h3>No bookings yet</h3><p>Your next getaway could be right around the corner.</p></div>}
  </div></ModalShell>;
}

function ModalShell({ children, onClose, wide }) {
  useEffect(() => { const listener = e => { if (e.key === "Escape") onClose(); }; document.addEventListener("keydown", listener); document.body.style.overflow = "hidden"; return () => { document.removeEventListener("keydown", listener); document.body.style.overflow = ""; }; }, []);
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div className={wide ? "modal-box wide-modal" : "modal-box"}>{children}</div></div>;
}
export default App;
