import '../styles/Navbar.css'

function Navbar() {
    return (
        <nav>
            <div className="wrapper">
                <div className="logo"><a href='#home'>SKBM</a></div>
                <div className="menu">
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#materi">Materi</a></li>
                        <li><a href="#tutors">Konsep</a></li>
                        <li><a href="#partners">Tools</a></li>
                        <li><a href="#contact">Kontak</a></li>
                        <li><a href="#contact" className="tbl-biru">Daftar Kelas</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar