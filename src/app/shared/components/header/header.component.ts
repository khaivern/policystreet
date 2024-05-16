import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent implements OnInit {
  HEADINGS = [
    "Discover your dream company",
    "Explore top companies and their PICs",
    "Find the perfect company for you",
    "Connect with industry-leading companies",
    "Unlock a world of business opportunities",
  ];

  currentIndex = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.HEADINGS.length;
    }, 5000);
  }
}
