export default function Header() {
    return (
      <>
        <div className="p-4 whitespace-nowrap">Gallery Gyundogan</div>
        <nav className="flex-grow p-4">
          <ul className="flex justify-end gap-4">
              <li>Gallery</li>
              <li>Login</li>
              <li>Register</li>
          </ul>
        </nav>
        
      </>
    );
  }