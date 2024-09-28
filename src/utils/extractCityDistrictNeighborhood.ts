// utils/extractCityDistrictNeighborhood.ts
export const extractCityDistrictNeighborhood = (location: string): string => {
    const cityPattern = /[가-힣]+시/;
    const districtPattern = /[가-힣]+구/;
    const neighborhoodPattern = /[가-힣]+동/;
  
    const cityMatch = location.match(cityPattern);
    const districtMatch = location.match(districtPattern);
    const neighborhoodMatch = location.match(neighborhoodPattern);
  
    if (cityMatch && districtMatch && neighborhoodMatch) {
      return `${cityMatch[0]} ${districtMatch[0]} ${neighborhoodMatch[0]}`;
    } else if (cityMatch && districtMatch) {
      return `${cityMatch[0]} ${districtMatch[0]}`;
    } else if (cityMatch) {
      return cityMatch[0];
    }
    return location;
  };